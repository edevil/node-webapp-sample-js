import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Card {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column("text")
  public title: string;

  @Column("text", {
    nullable: true,
  })
  public description: string;

  @Column("boolean", {
    default: false,
  })
  public done: boolean;
}
