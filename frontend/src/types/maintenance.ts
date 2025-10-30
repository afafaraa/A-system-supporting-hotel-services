export interface Issue {
    id: string;
    title: string;
    description?: string;
    roomNumber: string;
    status: IssueStatus;
    reportedBy: string;
    assignedTo?: string;
    reportedDate: string;
    resolvedDate?: string; 
}

export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface IssueRequest {
    title: string;
    description: string;
    roomNumber: string;
    reportedById: string;
}

export function getStatusColor(status: IssueStatus): 'default' | 'primary' | 'warning' | 'success' | 'error' {
    switch (status) {
        case 'OPEN':
            return 'error';
        case 'IN_PROGRESS':
            return 'warning';
        case 'RESOLVED':
            return 'success';
        case 'CLOSED':
            return 'default';
        default:
            return 'default';
    }
};