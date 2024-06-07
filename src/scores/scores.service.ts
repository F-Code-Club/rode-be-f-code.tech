import { Injectable } from '@nestjs/common';
import { Score } from './entities/scores.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  async getLeaderboard(roomId) {
    try {
      const data = await this.scoreRepository
        .createQueryBuilder('scores')
        .select(['scores.total_score', 'scores.penalty', 'teams.name'])
        .leftJoin('scores.team', 'teams')
        .where('scores.room_id = :roomId', { roomId })
        .orderBy('scores.total_score', 'DESC')
        .getRawMany();
      return [data, null];
    } catch (err) {
      return [null, err.message];
    }
  }
}
