import { ProjectStatus } from '../../enums/role.enums';

export interface CreateProjectRequest {
    topic: string;
    class: string;
    team_name: string;
    generation: string;
}

export interface UpdateProjectRequest {
    topic?: string;
    class?: string;
    status?: ProjectStatus;
    team_name?: string;
    generation?: string;
}