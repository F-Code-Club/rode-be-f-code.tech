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
    return await this.scoreRepository
      .createQueryBuilder('scores')
      .select(['teams.name', 'scores.total_score', 'scores.penalty'])
      .leftJoin('scores.team', 'teams')
      .where('scores.room_id = :roomId', { roomId })
      .orderBy('scores.total_score', 'DESC')
      .getRawMany()
      .then((result) => {
        if (result) return [result, null];
        return [null, 'Cannot found any scores!'];
      })
      .catch(() => {
        return [null, 'Error when querying scores'];
      });
  }
}
