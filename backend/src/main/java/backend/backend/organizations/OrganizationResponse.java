package backend.backend.organizations;

import backend.backend.entities.Organization;

public record OrganizationResponse(
        Long id,
        String name,
        Organization.OrgType type) {

    public static OrganizationResponse fromEntity(Organization organization) {
        return new OrganizationResponse(
                organization.getOrgId(),
                organization.getName(),
                organization.getType());
    }
}
