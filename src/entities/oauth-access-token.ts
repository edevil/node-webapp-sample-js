import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { OAuthClient } from "./oauth-client";
import { User } from "./user";

@Entity()
export class OAuthAccessToken {
  @PrimaryColumn()
  public accessToken: string;

  @ManyToOne(type => User, user => user.oauthAccessTokens, {
    onDelete: "CASCADE",
    primary: true,
  })
  public user: User;

  @ManyToOne(type => OAuthClient, client => client.oauthAccessTokens, {
    onDelete: "CASCADE",
    primary: true,
  })
  public client: OAuthClient;

  public scope: string;

  public accessTokenExpiresAt: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
