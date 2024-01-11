package nibm.hdse241.hospitalappointmentsystem.services;

import nibm.hdse241.hospitalappointmentsystem.entities.User;
import org.springframework.data.jpa.domain.Specification;

public class userSpecifications {

    // Username contains filter
    public static Specification<User> usernameContains(String username) {
        return (root, query, criteriaBuilder) -> {
            if (username == null || username.isEmpty()) {
                return criteriaBuilder.conjunction(); // No filter applied
            }
            return criteriaBuilder.like(root.get("username"), "%" + username + "%");
        };
    }

    // Role equals filter
    public static Specification<User> roleEquals(String role) {
        return (root, query, criteriaBuilder) -> {
            if (role == null || role.isEmpty()) {
                return criteriaBuilder.conjunction(); // No filter applied
            }
            return criteriaBuilder.equal(root.get("role"), role);
        };
    }

    // Email contains filter (if needed for more flexibility)
    public static Specification<User> emailContains(String email) {
        return (root, query, criteriaBuilder) -> {
            if (email == null || email.isEmpty()) {
                return criteriaBuilder.conjunction(); // No filter applied
            }
            return criteriaBuilder.like(root.get("email"), "%" + email + "%");
        };
    }
}
