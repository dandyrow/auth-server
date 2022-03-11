import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, Unique } from 'typeorm';
import { Authorisation } from './Authorisation';

@Entity('computer')
export class Computer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true, length: 512 })
    name: string;

    @Column('text')
    otpSecret: string;

    @OneToMany(() => Authorisation, auth => auth.computer)
    authorisations: Authorisation[];
}
