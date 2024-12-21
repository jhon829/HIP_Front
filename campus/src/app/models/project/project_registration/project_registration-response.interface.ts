import { Registration, TeamRole } from "../../enums/role.enums";

export interface ProjectRegistrationResponseData {
    registration_id: number;
    reporting_date: string;
    registration_status: Registration;
    project_role: string;
    team_role: TeamRole;
}