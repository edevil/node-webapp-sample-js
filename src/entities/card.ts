import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Card {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

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
