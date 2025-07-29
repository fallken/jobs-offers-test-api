import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { Currency, JobType } from '../types';

@Entity('jobs')
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 50
    })
    jobId: string;

    @Column({
        type: 'varchar',
        length: 100,
    })
    position: string;

    @Column({
        type: 'varchar',
        length: 50
    })
    state: string;

    @Index("IDX_state_city", ["state", "city"])
    @Column({
        type: 'varchar',
        length: 100,
    })
    city: string;

    @Index()
    @Column({
        type: 'varchar'
    })
    type: JobType;

    @Column({
        type: 'varchar',
        length: 10,
        default: Currency.USD,
    })
    currency: Currency;

    @Column()
    salaryMin: number;

    @Column({
        type: 'varchar'
    })
    salaryMax: number;

    @Column({
        type: 'varchar',
        length: 100,
    })
    company: string;

    @Column({ nullable: true, length: 100 })
    industry?: string | null;

    @Column({ nullable: true , length: 200 })
    website?: string | null;

    @Column({ nullable: true })
    minYearExperience?: number | null;

    @Index()
    @Column({ type: 'text', array: true })
    technologies: string[];

    @CreateDateColumn()
    datePosted: Date;

    @Column()
    createdAt: Date = new Date();
}