import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SocialLogin } from "./social-login";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column("text", {
    nullable: true,
    unique: true,
  })
  public username: string;

  @Column("text", {
    nullable: true,
  })
  public password: string;

  @Column("text", {
    unique: true,
  })
  public email: string;

  @OneToMany(type => SocialLogin, login => login.user)
  public socialLogins: SocialLogin[];
}
