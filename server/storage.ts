import { 
  User, InsertUser, users,
  Repository, InsertRepository, repositories,
  Application, InsertApplication, applications,
  Deployment, InsertDeployment, deployments,
  Activity, InsertActivity, activities,
  SyncResult, ClusterHealth
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Repository operations
  getRepositories(): Promise<Repository[]>;
  getRepository(id: number): Promise<Repository | undefined>;
  createRepository(repo: InsertRepository): Promise<Repository>;
  updateRepository(id: number, repo: Partial<InsertRepository>): Promise<Repository | undefined>;
  deleteRepository(id: number): Promise<boolean>;

  // Application operations
  getApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationByName(name: string): Promise<Application | undefined>;
  createApplication(app: InsertApplication): Promise<Application>;
  updateApplication(id: number, app: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(id: number): Promise<boolean>;

  // Deployment operations
  getDeployments(applicationId?: number): Promise<Deployment[]>;
  getDeployment(id: number): Promise<Deployment | undefined>;
  createDeployment(deployment: InsertDeployment): Promise<Deployment>;
  updateDeploymentStatus(id: number, status: string, finishedAt: Date, message?: string): Promise<Deployment | undefined>;

  // Activity operations
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Dashboard stats
  getClusterHealth(): Promise<ClusterHealth>;
  getDeploymentStats(): Promise<{today: number, total: number, success: number, pending: number, failed: number}>;
  getSyncStatus(): Promise<{synced: boolean, lastSyncTime: Date | null, revision: string | null}>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private repositories: Map<number, Repository>;
  private applications: Map<number, Application>;
  private deployments: Map<number, Deployment>;
  private activities: Activity[];
  
  // Auto-incrementing IDs
  private userId: number;
  private repoId: number;
  private appId: number;
  private deploymentId: number;
  private activityId: number;

  // Cluster state
  private clusterHealth: ClusterHealth;
  private syncStatus: {synced: boolean, lastSyncTime: Date | null, revision: string | null};

  constructor() {
    this.users = new Map();
    this.repositories = new Map();
    this.applications = new Map();
    this.deployments = new Map();
    this.activities = [];
    
    this.userId = 1;
    this.repoId = 1;
    this.appId = 1;
    this.deploymentId = 1;
    this.activityId = 1;

    // Initialize with sample admin user
    this.createUser({
      username: "admin",
      password: "admin", // In a real app, this would be hashed
      role: "admin"
    });

    // Initialize cluster health
    this.clusterHealth = {
      healthy: true,
      percentage: 98.7,
      trend: 1.2
    };

    // Initialize sync status
    this.syncStatus = {
      synced: true,
      lastSyncTime: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      revision: "main@8e7d3f2"
    };

    // Initialize with some sample data for development
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Repository operations
  async getRepositories(): Promise<Repository[]> {
    return Array.from(this.repositories.values());
  }

  async getRepository(id: number): Promise<Repository | undefined> {
    return this.repositories.get(id);
  }

  async createRepository(repo: InsertRepository): Promise<Repository> {
    const id = this.repoId++;
    const newRepo: Repository = { 
      ...repo, 
      id, 
      createdAt: new Date() 
    };
    this.repositories.set(id, newRepo);
    return newRepo;
  }

  async updateRepository(id: number, repo: Partial<InsertRepository>): Promise<Repository | undefined> {
    const existingRepo = this.repositories.get(id);
    if (!existingRepo) return undefined;

    const updatedRepo = { ...existingRepo, ...repo };
    this.repositories.set(id, updatedRepo);
    return updatedRepo;
  }

  async deleteRepository(id: number): Promise<boolean> {
    return this.repositories.delete(id);
  }

  // Application operations
  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationByName(name: string): Promise<Application | undefined> {
    return Array.from(this.applications.values()).find(
      (app) => app.name === name
    );
  }

  async createApplication(app: InsertApplication): Promise<Application> {
    const id = this.appId++;
    const newApp: Application = { 
      ...app, 
      id,
      lastSyncedAt: app.lastSyncedAt || null
    };
    this.applications.set(id, newApp);
    return newApp;
  }

  async updateApplication(id: number, app: Partial<InsertApplication>): Promise<Application | undefined> {
    const existingApp = this.applications.get(id);
    if (!existingApp) return undefined;

    const updatedApp = { ...existingApp, ...app };
    this.applications.set(id, updatedApp);
    return updatedApp;
  }

  async deleteApplication(id: number): Promise<boolean> {
    return this.applications.delete(id);
  }

  // Deployment operations
  async getDeployments(applicationId?: number): Promise<Deployment[]> {
    const allDeployments = Array.from(this.deployments.values());
    if (applicationId === undefined) {
      return allDeployments.sort((a, b) => 
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
    }
    return allDeployments
      .filter(d => d.applicationId === applicationId)
      .sort((a, b) => 
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
  }

  async getDeployment(id: number): Promise<Deployment | undefined> {
    return this.deployments.get(id);
  }

  async createDeployment(deployment: InsertDeployment): Promise<Deployment> {
    const id = this.deploymentId++;
    const newDeployment: Deployment = { 
      ...deployment, 
      id, 
      startedAt: new Date(),
      finishedAt: null
    };
    this.deployments.set(id, newDeployment);
    return newDeployment;
  }

  async updateDeploymentStatus(id: number, status: string, finishedAt: Date, message?: string): Promise<Deployment | undefined> {
    const deployment = this.deployments.get(id);
    if (!deployment) return undefined;

    const updatedDeployment = { 
      ...deployment, 
      status, 
      finishedAt, 
      message: message || deployment.message 
    };
    this.deployments.set(id, updatedDeployment);
    return updatedDeployment;
  }

  // Activity operations
  async getActivities(limit?: number): Promise<Activity[]> {
    const sorted = [...this.activities].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const newActivity: Activity = { 
      ...activity, 
      id, 
      timestamp: new Date()
    };
    this.activities.push(newActivity);
    return newActivity;
  }

  // Dashboard stats
  async getClusterHealth(): Promise<ClusterHealth> {
    return this.clusterHealth;
  }

  async getDeploymentStats(): Promise<{today: number, total: number, success: number, pending: number, failed: number}> {
    const allDeployments = Array.from(this.deployments.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayDeployments = allDeployments.filter(d => 
      new Date(d.startedAt) >= today
    );

    return {
      today: todayDeployments.length,
      total: allDeployments.length,
      success: allDeployments.filter(d => d.status === 'Successful').length,
      pending: allDeployments.filter(d => d.status === 'Pending').length,
      failed: allDeployments.filter(d => d.status === 'Failed').length
    };
  }

  async getSyncStatus(): Promise<{synced: boolean, lastSyncTime: Date | null, revision: string | null}> {
    return this.syncStatus;
  }

  async updateSyncStatus(synced: boolean, revision?: string): Promise<void> {
    this.syncStatus = {
      synced,
      lastSyncTime: new Date(),
      revision: revision || this.syncStatus.revision
    };
  }

  private initializeSampleData() {
    // Create sample repositories
    const infraRepo = this.createRepository({
      name: "infrastructure-repo",
      url: "https://github.com/org/infrastructure-repo.git",
      branch: "main"
    });
    
    const appRepo = this.createRepository({
      name: "application-repo",
      url: "https://github.com/org/application-repo.git",
      branch: "main"
    });

    // Create sample applications
    Promise.all([infraRepo, appRepo]).then(([infraRepo, appRepo]) => {
      this.createApplication({
        name: "Frontend",
        repoId: appRepo.id,
        path: "./frontend",
        environment: "Production",
        status: "Healthy",
        health: "Healthy",
        version: "v2.3.0",
        pods: "4/4",
        syncStatus: "Synced",
        lastSyncedAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      });
      
      this.createApplication({
        name: "API Service",
        repoId: appRepo.id,
        path: "./api-service",
        environment: "Production",
        status: "Degraded",
        health: "Degraded",
        version: "v1.5.2",
        pods: "2/4",
        syncStatus: "OutOfSync",
        lastSyncedAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
      });
      
      this.createApplication({
        name: "Database",
        repoId: infraRepo.id,
        path: "./database",
        environment: "Production",
        status: "Healthy",
        health: "Healthy",
        version: "v1.2.1",
        pods: "3/3",
        syncStatus: "Synced",
        lastSyncedAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      });
      
      this.createApplication({
        name: "Authentication",
        repoId: appRepo.id,
        path: "./auth",
        environment: "Production",
        status: "Progressing",
        health: "Progressing",
        version: "v1.0.8",
        pods: "2/2",
        syncStatus: "Synced",
        lastSyncedAt: new Date(Date.now() - 90 * 60 * 1000) // 1.5 hours ago
      });

      // Create sample deployments
      this.createDeployment({
        applicationId: 1, // Frontend
        revision: "frontend@v2.3.0",
        status: "Successful",
        initiatedBy: "CI/CD Pipeline",
        message: "Frontend application deployed successfully to production",
        details: { commitHash: "abc123", author: "CI/CD Pipeline" }
      });

      this.createDeployment({
        applicationId: 2, // API Service
        revision: "api-service@v1.5.2",
        status: "Failed",
        initiatedBy: "CI/CD Pipeline",
        message: "Backend API deployment failed due to missing environment variables",
        details: { error: "Missing environment variables", commitHash: "def456" }
      });

      // Create sample activities
      this.createActivity({
        type: "Deployment",
        deploymentId: 1,
        applicationId: 1,
        description: "Deployment Successful",
        details: { message: "Frontend application deployed successfully to production" }
      });

      this.createActivity({
        type: "Sync",
        applicationId: null,
        description: "Sync In Progress",
        details: { repository: "infrastructure-repo", revision: "main@8e7d3f2" }
      });

      this.createActivity({
        type: "Deployment",
        deploymentId: 2,
        applicationId: 2,
        description: "Deployment Failed",
        details: { message: "Backend API deployment failed due to missing environment variables" }
      });

      this.createActivity({
        type: "Configuration",
        userId: 1,
        description: "Configuration Updated",
        details: { config: "database-config.yaml", user: "Admin User" }
      });
    });
  }
}

export const storage = new MemStorage();
