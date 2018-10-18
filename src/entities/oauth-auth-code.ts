import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { OAuthClient } from "./oauth-client";
import { User } from "./user";

@Entity()
export class OAuthAuthorizationCode {
  @PrimaryColumn()
  public authorizationCode: string;

  public expiresAt: Date;

  public redirectUri: string;

  public scope: string;

  @ManyToOne(type => User, user => user.oauthAuthorizationCodes, {
    onDelete: "CASCADE",
  })
  public user: User;

  @ManyToOne(type => OAuthClient, client => client.oauthAuthorizationCodes, {
    onDelete: "CASCADE",
  })
  public client: OAuthClient;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
