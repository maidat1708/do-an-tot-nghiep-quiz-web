package com.example.samuel_quiz.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String username;
    String password;
    String role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @ToString.Exclude  // Thêm annotation này
    @EqualsAndHashCode.Exclude  // Thêm annotation này
    Profile profile;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude  // Thêm annotation này
    @EqualsAndHashCode.Exclude  // Thêm annotation này
    Set<Result> results;
}
