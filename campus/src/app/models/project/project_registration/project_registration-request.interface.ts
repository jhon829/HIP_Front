import { Registration, TeamRole } from "../../enums/role.enums";

export interface ProjectRegistrationRequestData {
    registration_status?: Registration;
    project_role?: string;
    team_role?: TeamRole;
}