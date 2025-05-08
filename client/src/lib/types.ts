import { Application, Repository, Activity, Deployment } from "@shared/schema";

export interface DashboardData {
  applications: Application[];
  activities: Activity[];
  clusterHealth: ClusterHealth;
  deploymentStats: DeploymentStats;
  syncStatus: SyncStatus;
}

export interface ClusterHealth {
  healthy: boolean;
  percentage: number;
  trend: number;
  message?: string;
}

export interface DeploymentStats {
  today: number;
  total: number;
  success: number;
  pending: number;
  failed: number;
}

export interface SyncStatus {
  synced: boolean;
  lastSyncTime: Date | null;
  revision: string | null;
}

export interface WebSocketMessage {
  type: string;
  data: any;
}

export type ActivityType = 'Deployment' | 'Sync' | 'Application' | 'Repository' | 'Configuration';
export type ApplicationStatus = 'Healthy' | 'Degraded' | 'Progressing' | 'Missing' | 'Unknown';
export type DeploymentStatus = 'Successful' | 'Failed' | 'Pending' | 'Rollback';
export type SyncStatusType = 'Synced' | 'OutOfSync' | 'Unknown';

export interface ApplicationDisplayItem {
  id: number;
  name: string;
  status: ApplicationStatus;
  environment: string;
  version: string;
  pods: string;
  syncStatus: SyncStatusType;
}

export interface InfrastructureNode {
  id: string;
  type: 'app' | 'service' | 'database' | 'pod' | 'cluster';
  name: string;
  status: 'healthy' | 'degraded' | 'progressing' | 'unknown';
  parentId?: string;
  children?: string[];
  data?: any;
}

export interface InfrastructureLink {
  source: string;
  target: string;
  type: 'contains' | 'depends-on' | 'communicates-with';
}

export interface InfrastructureTopology {
  nodes: InfrastructureNode[];
  links: InfrastructureLink[];
}

export interface TimelineItem {
  id: number;
  timestamp: Date;
  applicationId: number;
  applicationName: string;
  type: 'deployment' | 'sync' | 'rollback' | 'config-change';
  status: 'success' | 'failure' | 'pending' | 'inProgress';
  version?: string;
  message?: string;
}
