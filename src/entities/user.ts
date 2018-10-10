import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { SocialLogin } from "@app/entities/social-login";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column("text", {
    unique: true,
    nullable: true,
  })
  username: string;

  @Column("text", {
    nullable: true,
  })
  password: string;

  @Column("text", {
    unique: true,
  })
  email: string;

  @OneToMany(type => SocialLogin, login => login.user, {
    onDelete: "CASCADE",
  })
  socialLogins: SocialLogin[];
}
