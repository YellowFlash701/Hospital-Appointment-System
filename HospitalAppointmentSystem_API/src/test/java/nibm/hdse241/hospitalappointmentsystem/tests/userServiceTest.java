package nibm.hdse241.hospitalappointmentsystem.tests;

import nibm.hdse241.hospitalappointmentsystem.entities.User;
import nibm.hdse241.hospitalappointmentsystem.repositories.userRepository;
import nibm.hdse241.hospitalappointmentsystem.services.userService;
import nibm.hdse241.hospitalappointmentsystem.services.userSpecifications;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class userServiceTest {

    @InjectMocks
    private userService userService; // Service class to be tested

    @Mock
    private userRepository userRepository; // Mocking the User repository

    @Mock
    private PasswordEncoder passwordEncoder; // Mocking the Password Encoder


    @Mock
    private userSpecifications userSpecifications; // Mocked specifications

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegisterUser() {
        // Create a mock User
        User mockUser = new User();
        mockUser.setPassword("password123");
        mockUser.setFullName("John Doe");

        // Mock the behavior of the password encoder
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        // Mock the behavior of userRepository
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // Call the registerUser method
        User registeredUser = userService.registerUser(mockUser);

        // Assertions
        Assertions.assertNotNull(registeredUser);
        Assertions.assertEquals("encodedPassword", registeredUser.getPassword());
        Assertions.assertEquals("John Doe", registeredUser.getFullName());
        verify(userRepository, times(1)).save(mockUser); // Verify save was called once
    }

    @Test
    public void testGetUsers() {
        // Create a list of mock Users
        List<User> mockUsers = new ArrayList<>();
        User user1 = new User();
        user1.setFullName("John Doe");
        user1.setUsername("johndoe");
        user1.setEmail("johndoe@example.com");

        User user2 = new User();
        user2.setFullName("Jane Doe");
        user2.setUsername("janedoe");
        user2.setEmail("janedoe@example.com");

        mockUsers.add(user1);
        mockUsers.add(user2);

        // Mock the behavior of userRepository to return the mock Users
        when(userRepository.findAll(any(Specification.class))).thenReturn(mockUsers);

        // Call the getUsers method with relevant parameters
        List<User> users = userService.getUsers("john", null, null); // Adjust parameters as needed

        // Assertions
        assertNotNull(users);
        assertEquals(2, users.size()); // We expect to get 2 users
        assertEquals("John Doe", users.get(0).getFullName());
        assertEquals("Jane Doe", users.get(1).getFullName());
    }



    @Test
    public void testFindUserByNic() {
        // Create a mock User
        User mockUser = new User();
        mockUser.setNic("NIC123");

        // Mock the behavior of userRepository
        when(userRepository.findByNic("NIC123")).thenReturn(List.of(mockUser));

        // Call the findUserByNic method
        List<User> users = userService.findUserByNic("NIC123");

        // Assertions
        Assertions.assertNotNull(users);
        Assertions.assertEquals(1, users.size());
        Assertions.assertEquals("NIC123", users.get(0).getNic());
        verify(userRepository, times(1)).findByNic("NIC123");
    }

    @Test
    public void testFindUserByEmail() {
        // Create a mock User
        User mockUser = new User();
        mockUser.setEmail("johndoe@example.com");

        // Mock the behavior of userRepository
        when(userRepository.findByEmail("johndoe@example.com")).thenReturn(Optional.of(mockUser));

        // Call the findUserByEmail method
        Optional<User> foundUser = userService.findUserByEmail("johndoe@example.com");

        // Assertions
        Assertions.assertTrue(foundUser.isPresent());
        Assertions.assertEquals("johndoe@example.com", foundUser.get().getEmail());
        verify(userRepository, times(1)).findByEmail("johndoe@example.com");
    }

    @Test
    public void testDeleteUserById() {
        Long userId = 1L;

        // Mock the behavior of userRepository
        when(userRepository.existsById(userId)).thenReturn(true);

        // Call the deleteUserById method
        boolean result = userService.deleteUserById(userId);

        // Assertions
        Assertions.assertTrue(result);
        verify(userRepository, times(1)).deleteById(userId);
    }

    @Test
    public void testDeleteUserById_UserNotFound() {
        Long userId = 1L;

        // Mock the behavior of userRepository
        when(userRepository.existsById(userId)).thenReturn(false);

        // Call the deleteUserById method
        boolean result = userService.deleteUserById(userId);

        // Assertions
        Assertions.assertFalse(result);
        verify(userRepository, never()).deleteById(userId); // Ensure delete was not called
    }

    @Test
    public void testRegisterOrValidateUser_AlreadyRegistered() {
        // Create a new user
        User newUser = new User();
        newUser.setNic("NIC123");
        newUser.setFullName("John Doe");
        newUser.setEmail("johndoe@example.com");
        newUser.setPhone("1234567890");

        // Create an existing user with the same NIC and details
        User existingUser = new User();
        existingUser.setFullName("John Doe");
        existingUser.setEmail("johndoe@example.com");
        existingUser.setPhone("1234567890");

        // Mock the behavior of userRepository
        when(userRepository.findByNic(newUser.getNic())).thenReturn(List.of(existingUser));

        // Call the registerOrValidateUser method
        String result = userService.registerOrValidateUser(newUser);

        // Assertions
        Assertions.assertEquals("User already registered.", result);
    }

    @Test
    public void testRegisterOrValidateUser_PersonalDataMismatch() {
        // Create a new user
        User newUser = new User();
        newUser.setNic("NIC123");
        newUser.setFullName("John Doe");
        newUser.setEmail("johndoe@example.com");
        newUser.setPhone("1234567890");

        // Create an existing user with the same NIC but different details
        User existingUser = new User();
        existingUser.setFullName("Jane Doe"); // Different full name
        existingUser.setEmail("johndoe@example.com");
        existingUser.setPhone("1234567890");

        // Mock the behavior of userRepository
        when(userRepository.findByNic(newUser.getNic())).thenReturn(List.of(existingUser));

        // Call the registerOrValidateUser method
        String result = userService.registerOrValidateUser(newUser);

        // Assertions
        Assertions.assertEquals("Personal data mismatch for the provided NIC!", result);
    }

    @Test
    public void testRegisterOrValidateUser_Success() {
        // Create a new user
        User newUser = new User();
        newUser.setNic("NIC123");
        newUser.setFullName("John Doe");
        newUser.setEmail("johndoe@example.com");
        newUser.setPhone("1234567890");

        // Mock the behavior of userRepository
        when(userRepository.findByNic(newUser.getNic())).thenReturn(new ArrayList<>()); // No existing users

        // Mock the behavior of userRepository to save the user
        when(userRepository.save(any(User.class))).thenReturn(newUser);

        // Call the registerOrValidateUser method
        String result = userService.registerOrValidateUser(newUser);

        // Assertions
        Assertions.assertEquals("User successfully registered.", result);
        verify(userRepository, times(1)).save(newUser); // Verify save was called once
    }
}
