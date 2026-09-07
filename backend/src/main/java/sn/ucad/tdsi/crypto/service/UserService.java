package sn.ucad.tdsi.crypto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sn.ucad.tdsi.crypto.dto.UserDto;
import sn.ucad.tdsi.crypto.exception.EntityNotFoundException;
import sn.ucad.tdsi.crypto.exception.RequestException;
import sn.ucad.tdsi.crypto.mapper.UserMapper;
import sn.ucad.tdsi.crypto.model.User;
import sn.ucad.tdsi.crypto.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditService auditService;

    @Autowired
    private UserMapper userMapper;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("user.notfound", new Object[]{id}));
        return mapToDto(user);
    }

    public UserDto createUser(UserDto dto) {
        if (userRepository.existsByLogin(dto.getLogin())) {
            throw new RequestException("user.exists", new Object[]{dto.getLogin()});
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RequestException("user.exists", new Object[]{dto.getEmail()});
        }

        User user = new User();
        user.setLogin(dto.getLogin());
        String rawPassword = (dto.getPassword() != null && !dto.getPassword().isEmpty()) ? dto.getPassword() : "user123";
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setEmail(dto.getEmail());
        user.setNomComplet(dto.getNomComplet());
        user.setRole((dto.getRole() != null && dto.getRole().equalsIgnoreCase("admin")) ? "admin" : "user");
        user.setActif(dto.getActif() != null ? dto.getActif() : true);
        user.setDateCreation(LocalDateTime.now());

        User saved = userRepository.save(user);
        auditService.logAction(saved.getId(), saved.getLogin(), "CREATE_USER", "SYSTEM", "SUCCES", "Création de l'utilisateur " + saved.getLogin());
        return mapToDto(saved);
    }

    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("user.notfound", new Object[]{id}));

        if (dto.getNomComplet() != null) user.setNomComplet(dto.getNomComplet());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getRole() != null) user.setRole(dto.getRole());
        if (dto.getActif() != null) user.setActif(dto.getActif());
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User updated = userRepository.save(user);
        auditService.logAction(updated.getId(), updated.getLogin(), "UPDATE_USER", "SYSTEM", "SUCCES", "Mise à jour de l'utilisateur " + updated.getLogin());
        return mapToDto(updated);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("user.notfound", new Object[]{id}));
        if ("admin".equalsIgnoreCase(user.getLogin())) {
            throw new RequestException("user.errordeletion", new Object[]{id});
        }
        userRepository.deleteById(id);
        auditService.logAction(id, user.getLogin(), "DELETE_USER", "SYSTEM", "SUCCES", "Suppression du compte " + user.getLogin());
    }

    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream().filter(User::getActif).count();
        long adminCount = userRepository.findAll().stream().filter(u -> "admin".equalsIgnoreCase(u.getRole())).count();
        long userCount = totalUsers - adminCount;

        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("adminCount", adminCount);
        stats.put("userCount", userCount);
        stats.put("status", "UP");
        return stats;
    }

    public UserDto mapToDto(User user) {
        return userMapper.toDto(user);
    }
}
