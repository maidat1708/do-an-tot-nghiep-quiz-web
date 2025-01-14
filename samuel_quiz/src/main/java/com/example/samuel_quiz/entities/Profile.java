package com.example.samuel_quiz.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "profile_id_gen")
    @SequenceGenerator(name = "profile_id_gen", sequenceName = "profile_SEQ", allocationSize = 1)
    Long id;
    String email;
    String firstName;
    String lastName;
    String phoneNumber;
    String address;
    LocalDate birthDay;
    Integer gender;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @ToString.Exclude  // Thêm annotation này
    @EqualsAndHashCode.Exclude
    User user;
}
