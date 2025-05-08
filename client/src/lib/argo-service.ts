import { queryClient, apiRequest } from '@/lib/queryClient';
import { Application, Repository, Activity, Deployment } from '@shared/schema';
import { ClusterHealth, DeploymentStats, SyncStatus, InfrastructureTopology, TimelineItem } from './types';

// Fetch dashboard data
export async function fetchDashboardData() {
  const response = await apiRequest('GET', '/api/dashboard', undefined);
  return response.json();
}

// Applications
export async function fetchApplications(): Promise<Application[]> {
  const response = await apiRequest('GET', '/api/applications', undefined);
  return response.json();
}

export async function fetchApplication(id: number): Promise<Application> {
  const response = await apiRequest('GET', `/api/applications/${id}`, undefined);
  return response.json();
}

export async function createApplication(application: Omit<Application, 'id' | 'lastSyncedAt'>) {
  const response = await apiRequest('POST', '/api/applications', application);
  const newApplication = await response.json();
  queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
  return newApplication;
}

export async function updateApplication(id: number, application: Partial<Application>) {
  const response = await apiRequest('PATCH', `/api/applications/${id}`, application);
  const updatedApplication = await response.json();
  queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
  queryClient.invalidateQueries({ queryKey: [`/api/applications/${id}`] });
  return updatedApplication;
}

export async function deleteApplication(id: number) {
  await apiRequest('DELETE', `/api/applications/${id}`, undefined);
  queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
}

// Repositories
export async function fetchRepositories(): Promise<Repository[]> {
  const response = await apiRequest('GET', '/api/repositories', undefined);
  return response.json();
}

export async function createRepository(repository: Omit<Repository, 'id' | 'createdAt'>) {
  const response = await apiRequest('POST', '/api/repositories', repository);
  const newRepo = await response.json();
  queryClient.invalidateQueries({ queryKey: ['/api/repositories'] });
  return newRepo;
}

// Deployments
export async function fetchDeployments(applicationId?: number): Promise<Deployment[]> {
  const url = applicationId 
    ? `/api/deployments?applicationId=${applicationId}` 
    : '/api/deployments';
  const response = await apiRequest('GET', url, undefined);
  return response.json();
}

export async function createDeployment(deployment: Omit<Deployment, 'id' | 'startedAt' | 'finishedAt'>) {
  const response = await apiRequest('POST', '/api/deployments', deployment);
  const newDeployment = await response.json();
  queryClient.invalidateQueries({ queryKey: ['/api/deployments'] });
  return newDeployment;
}

// Activities
export async function fetchActivities(limit?: number): Promise<Activity[]> {
  const url = limit ? `/api/activities?limit=${limit}` : '/api/activities';
  const response = await apiRequest('GET', url, undefined);
  return response.json();
}

export async function createActivity(activity: Omit<Activity, 'id' | 'timestamp'>) {
  const response = await apiRequest('POST', '/api/activities', activity);
  const newActivity = await response.json();
  queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
  return newActivity;
}

// ArgoCD specific operations
export async function syncApplication(applicationId: number, user?: string) {
  const response = await apiRequest('POST', `/api/sync/${applicationId}`, { user });
  const result = await response.json();
  queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
  queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}`] });
  return result;
}

export async function syncAllApplications(user?: string, revision?: string) {
  const response = await apiRequest('POST', '/api/sync-all', { user, revision });
  const result = await response.json();
  queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
  return result;
}

// Dashboard stats
export async function fetchClusterHealth(): Promise<ClusterHealth> {
  const response = await apiRequest('GET', '/api/dashboard', undefined);
  const data = await response.json();
  return data.clusterHealth;
}

export async function fetchDeploymentStats(): Promise<DeploymentStats> {
  const response = await apiRequest('GET', '/api/dashboard', undefined);
  const data = await response.json();
  return data.deploymentStats;
}

export async function fetchSyncStatus(): Promise<SyncStatus> {
  const response = await apiRequest('GET', '/api/dashboard', undefined);
  const data = await response.json();
  return data.syncStatus;
}

// This would be integrated with the actual ArgoCD API in a real implementation
export async function fetchInfrastructureTopology(): Promise<InfrastructureTopology> {
  // In a real implementation, this would fetch from ArgoCD API
  // For now, return a mock topology for demonstration
  return {
    nodes: [
      { id: 'cluster1', type: 'cluster', name: 'Production Cluster', status: 'healthy' },
      { id: 'app1', type: 'app', name: 'Frontend', status: 'healthy', parentId: 'cluster1' },
      { id: 'app2', type: 'app', name: 'API Service', status: 'degraded', parentId: 'cluster1' },
      { id: 'app3', type: 'app', name: 'Database', status: 'healthy', parentId: 'cluster1' },
      { id: 'app4', type: 'app', name: 'Authentication', status: 'progressing', parentId: 'cluster1' },
      { id: 'pod1', type: 'pod', name: 'frontend-pod-1', status: 'healthy', parentId: 'app1' },
      { id: 'pod2', type: 'pod', name: 'frontend-pod-2', status: 'healthy', parentId: 'app1' },
      { id: 'pod3', type: 'pod', name: 'api-pod-1', status: 'degraded', parentId: 'app2' },
      { id: 'pod4', type: 'pod', name: 'api-pod-2', status: 'healthy', parentId: 'app2' },
      { id: 'pod5', type: 'pod', name: 'db-pod-1', status: 'healthy', parentId: 'app3' },
      { id: 'pod6', type: 'pod', name: 'auth-pod-1', status: 'progressing', parentId: 'app4' },
    ],
    links: [
      { source: 'cluster1', target: 'app1', type: 'contains' },
      { source: 'cluster1', target: 'app2', type: 'contains' },
      { source: 'cluster1', target: 'app3', type: 'contains' },
      { source: 'cluster1', target: 'app4', type: 'contains' },
      { source: 'app1', target: 'pod1', type: 'contains' },
      { source: 'app1', target: 'pod2', type: 'contains' },
      { source: 'app2', target: 'pod3', type: 'contains' },
      { source: 'app2', target: 'pod4', type: 'contains' },
      { source: 'app3', target: 'pod5', type: 'contains' },
      { source: 'app4', target: 'pod6', type: 'contains' },
      { source: 'app1', target: 'app2', type: 'depends-on' },
      { source: 'app2', target: 'app3', type: 'depends-on' },
      { source: 'app1', target: 'app4', type: 'depends-on' },
      { source: 'app2', target: 'app4', type: 'depends-on' },
    ]
  };
}

export async function fetchDeploymentTimeline(): Promise<TimelineItem[]> {
  // In a real implementation, this would be derived from actual deployment data
  // For now, generate sample timeline data
  const deployments = await fetchDeployments();
  
  return deployments.map(deployment => {
    return {
      id: deployment.id,
      timestamp: new Date(deployment.startedAt),
      applicationId: deployment.applicationId,
      applicationName: `App ${deployment.applicationId}`, // Would need to look up actual names
      type: 'deployment',
      status: deployment.status === 'Successful' ? 'success' : 
             deployment.status === 'Failed' ? 'failure' : 
             deployment.status === 'Pending' ? 'pending' : 'inProgress',
      version: deployment.revision,
      message: deployment.message
    };
  });
}
