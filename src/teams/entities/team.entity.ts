import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";
import { Score } from "submit-history/entities/scores.entity";

@Entity({name: 'teams'})
export class Team {
    @PrimaryGeneratedColumn('increment',{name: 'id'})
    id:number;
    @Column({name: 'name', unique: true, type: "varchar", length: 128})
    name: string;
    @Column({name: 'member_count', type: 'int'})
    memberCount: number;
    @OneToMany(() => Member, (member) => member.team, {
        cascade: ["insert"],
        onDelete: 'CASCADE'
    })
    members: Member[];

    @OneToMany(() => Score, (score) => score.team, {nullable: false})
    scores?: Score[]
}