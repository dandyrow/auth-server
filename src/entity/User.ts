import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, Unique } from 'typeorm';
import { Authorisation } from './Authorisation';

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true, length: 512 })
    username: string;

    @Column('text')
    password: string;

    @Column('int', { default: 0 })
    tokenVersion: number;

    @OneToMany(() => Authorisation, (auth) => auth.user)
    authorisations: Authorisation[];
}
