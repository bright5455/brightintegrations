import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async classifyName(name: string) {
    let rawData: any;

    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://api.genderize.io`, {
          params: { name },
        }),
      );
      rawData = response.data;
    } catch {
      throw new HttpException(
        { status: 'error', message: 'Upstream or server failure' },
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (rawData.gender === null || rawData.count === 0) {
      return {
        status: 'error',
        message: 'No prediction available for the provided name',
      };
    }

    const sample_size: number = rawData.count;
    const probability: number = rawData.probability;

    return {
      status: 'success',
      data: {
        name: rawData.name,
        gender: rawData.gender,
        probability,
        sample_size,
        is_confident: probability >= 0.7 && sample_size >= 100,
        processed_at: new Date().toISOString(),
      },
    };
  }
}