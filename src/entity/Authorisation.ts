import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { Computer } from './Computer';
import { User } from './User';

@Entity('authorisation')
export class Authorisation extends BaseEntity {
    @PrimaryColumn()
    userId: number;
    @ManyToOne(() => User, (user) => user.authorisations, { primary: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @PrimaryColumn()
    computerId: number;
    @ManyToOne(() => Computer, (computer) => computer.authorisations, {
        primary: true,
    })
    @JoinColumn({ name: 'computerId' })
    computer: Computer;

    @Column('boolean', { default: false })
    authorised: boolean;
}
