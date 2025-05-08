import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { insertActivitySchema, insertApplicationSchema, insertDeploymentSchema, insertRepositorySchema } from "@shared/schema";

// Helper for WebSocket broadcasts
function broadcastMessage(wss: WebSocketServer, type: string, data: any) {
  const message = JSON.stringify({ type, data });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Send initial state on connection
    const sendInitialState = async () => {
      try {
        const applications = await storage.getApplications();
        const activities = await storage.getActivities(10);
        const clusterHealth = await storage.getClusterHealth();
        const deploymentStats = await storage.getDeploymentStats();
        const syncStatus = await storage.getSyncStatus();
        
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ 
            type: 'initialState', 
            data: {
              applications,
              activities,
              clusterHealth,
              deploymentStats,
              syncStatus
            }
          }));
        }
      } catch (error) {
        console.error('Error sending initial state:', error);
      }
    };
    
    sendInitialState();
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types from client
        if (data.type === 'syncApplication') {
          // Implementation would call ArgoCD API
          console.log(`Syncing application: ${data.applicationId}`);
          
          // Simulate sync process
          const app = await storage.getApplication(data.applicationId);
          if (app) {
            // Update sync status
            await storage.updateApplication(app.id, { 
              syncStatus: 'Synced',
              lastSyncedAt: new Date()
            });
            
            // Create activity
            await storage.createActivity({
              type: 'Sync',
              applicationId: app.id,
              description: `Application ${app.name} synced`,
              details: { initiatedBy: data.user || 'system' }
            });
            
            // Broadcast updates
            const updatedApp = await storage.getApplication(app.id);
            const activities = await storage.getActivities(10);
            
            broadcastMessage(wss, 'applicationUpdated', updatedApp);
            broadcastMessage(wss, 'activitiesUpdated', activities);
          }
        }
        
        if (data.type === 'forceSync') {
          // Implementation would call ArgoCD API to force sync all apps
          console.log('Force syncing all applications');
          
          // Update sync status
          await storage.updateSyncStatus(true, data.revision || 'main@8e7d3f2');
          
          // Create activity
          await storage.createActivity({
            type: 'Sync',
            description: 'Force sync initiated for all applications',
            details: { initiatedBy: data.user || 'system' }
          });
          
          // Broadcast updates
          const syncStatus = await storage.getSyncStatus();
          const activities = await storage.getActivities(10);
          
          broadcastMessage(wss, 'syncStatusUpdated', syncStatus);
          broadcastMessage(wss, 'activitiesUpdated', activities);
        }
      } catch (error) {
        console.error('Error processing websocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // API Routes
  // Dashboard data
  app.get('/api/dashboard', async (req: Request, res: Response) => {
    try {
      const applications = await storage.getApplications();
      const activities = await storage.getActivities(10);
      const clusterHealth = await storage.getClusterHealth();
      const deploymentStats = await storage.getDeploymentStats();
      const syncStatus = await storage.getSyncStatus();
      
      res.json({
        applications,
        activities,
        clusterHealth,
        deploymentStats,
        syncStatus
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching dashboard data' });
    }
  });

  // Applications endpoints
  app.get('/api/applications', async (req: Request, res: Response) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching applications' });
    }
  });
  
  app.get('/api/applications/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getApplication(id);
      
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching application' });
    }
  });
  
  app.post('/api/applications', async (req: Request, res: Response) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(applicationData);
      
      // Create activity
      await storage.createActivity({
        type: 'Application',
        applicationId: application.id,
        description: `Application ${application.name} created`,
        details: { user: req.body.user || 'system' }
      });
      
      // Broadcast update
      broadcastMessage(wss, 'applicationCreated', application);
      
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid application data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating application' });
    }
  });
  
  app.patch('/api/applications/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getApplication(id);
      
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      const updateData = req.body;
      const updatedApplication = await storage.updateApplication(id, updateData);
      
      // Create activity
      await storage.createActivity({
        type: 'Application',
        applicationId: id,
        description: `Application ${application.name} updated`,
        details: { user: req.body.user || 'system', changes: updateData }
      });
      
      // Broadcast update
      broadcastMessage(wss, 'applicationUpdated', updatedApplication);
      
      res.json(updatedApplication);
    } catch (error) {
      res.status(500).json({ message: 'Error updating application' });
    }
  });
  
  app.delete('/api/applications/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getApplication(id);
      
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      const deleted = await storage.deleteApplication(id);
      
      if (deleted) {
        // Create activity
        await storage.createActivity({
          type: 'Application',
          description: `Application ${application.name} deleted`,
          details: { user: req.body.user || 'system' }
        });
        
        // Broadcast update
        broadcastMessage(wss, 'applicationDeleted', { id });
        
        res.status(204).send();
      } else {
        res.status(500).json({ message: 'Error deleting application' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting application' });
    }
  });

  // Repository endpoints
  app.get('/api/repositories', async (req: Request, res: Response) => {
    try {
      const repositories = await storage.getRepositories();
      res.json(repositories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching repositories' });
    }
  });
  
  app.post('/api/repositories', async (req: Request, res: Response) => {
    try {
      const repoData = insertRepositorySchema.parse(req.body);
      const repository = await storage.createRepository(repoData);
      
      // Create activity
      await storage.createActivity({
        type: 'Repository',
        description: `Repository ${repository.name} created`,
        details: { user: req.body.user || 'system' }
      });
      
      // Broadcast update
      broadcastMessage(wss, 'repositoryCreated', repository);
      
      res.status(201).json(repository);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid repository data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating repository' });
    }
  });

  // Deployment endpoints
  app.get('/api/deployments', async (req: Request, res: Response) => {
    try {
      const applicationId = req.query.applicationId ? parseInt(req.query.applicationId as string) : undefined;
      const deployments = await storage.getDeployments(applicationId);
      res.json(deployments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching deployments' });
    }
  });
  
  app.post('/api/deployments', async (req: Request, res: Response) => {
    try {
      const deploymentData = insertDeploymentSchema.parse(req.body);
      const deployment = await storage.createDeployment(deploymentData);
      
      // Create activity
      await storage.createActivity({
        type: 'Deployment',
        deploymentId: deployment.id,
        applicationId: deployment.applicationId,
        description: `Deployment initiated for application ${deployment.applicationId}`,
        details: { user: req.body.user || 'system', status: deployment.status }
      });
      
      // Broadcast update
      broadcastMessage(wss, 'deploymentCreated', deployment);
      
      res.status(201).json(deployment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid deployment data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating deployment' });
    }
  });

  // Activity endpoints
  app.get('/api/activities', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching activities' });
    }
  });
  
  app.post('/api/activities', async (req: Request, res: Response) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      
      // Broadcast update
      broadcastMessage(wss, 'activityCreated', activity);
      
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid activity data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating activity' });
    }
  });

  // ArgoCD integration endpoints
  app.post('/api/sync/:applicationId', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.applicationId);
      const application = await storage.getApplication(id);
      
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      // This would call the ArgoCD API to sync the application
      // For now, we'll simulate the sync
      
      // Update application sync status
      await storage.updateApplication(id, { 
        syncStatus: 'Synced',
        lastSyncedAt: new Date()
      });
      
      // Create activity
      await storage.createActivity({
        type: 'Sync',
        applicationId: id,
        description: `Application ${application.name} synced`,
        details: { user: req.body.user || 'system' }
      });
      
      // Get updated application
      const updatedApplication = await storage.getApplication(id);
      
      // Broadcast update
      broadcastMessage(wss, 'applicationUpdated', updatedApplication);
      
      res.json({
        success: true,
        message: `Application ${application.name} synced successfully`
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Error syncing application'
      });
    }
  });
  
  app.post('/api/sync-all', async (req: Request, res: Response) => {
    try {
      // This would call the ArgoCD API to sync all applications
      // For now, we'll simulate the sync
      
      // Update sync status
      await storage.updateSyncStatus(true, req.body.revision);
      
      // Create activity
      await storage.createActivity({
        type: 'Sync',
        description: 'Force sync initiated for all applications',
        details: { user: req.body.user || 'system' }
      });
      
      // Get updated sync status
      const syncStatus = await storage.getSyncStatus();
      
      // Broadcast update
      broadcastMessage(wss, 'syncStatusUpdated', syncStatus);
      
      res.json({
        success: true,
        message: 'Force sync initiated for all applications'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Error syncing applications'
      });
    }
  });

  return httpServer;
}
