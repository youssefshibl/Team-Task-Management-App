import { Injectable } from '@nestjs/common';
import {
  DeleteResult,
  Model,
  Types,
  PopulateOptions,
  QueryOptions,
} from 'mongoose';

@Injectable()
export abstract class BaseRepository<T> {
  protected model: Model<T>;
  protected defaultPopulate: PopulateOptions[] = [];

  protected _context_query = {
    _deleted: {
      $ne: true,
    },
  };

  constructor(model: Model<T>) {
    if (!model) {
      throw new Error('Model is required');
    }
    if (typeof model.create !== 'function') {
      throw new Error('Model must be a Mongoose model');
    }
    this.model = model;
  }

  public findById(id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findById(id).populate(this.defaultPopulate).exec();
  }

  public create(data): Promise<T> {
    return this.model.create(data);
  }
  public findOne(query: Record<string, any>): Promise<T | null> {
    return this.model.findOne(this.injectContextQuery(query)).exec();
  }

  public findOneWithPopulate(
    query: Record<string, any>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<T | null> {
    let queryBuilder = this.model.findOne(this.injectContextQuery(query));

    if (populate) {
      queryBuilder = queryBuilder.populate(populate);
    }

    return queryBuilder.exec();
  }
  public update(
    id: string,
    data: Record<string, any>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<T | null> {
    let queryBuilder = this.model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (populate) {
      queryBuilder = queryBuilder.populate(populate);
    }
    return queryBuilder.exec();
  }

  public findOneAndUpdate(
    query: Record<string, any>,
    data: Record<string, any>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(this.injectContextQuery(query), data, {
        new: true,
        ...options,
      })
      .exec();
  }

  public softDelete(id: string | Types.ObjectId): Promise<T | null> {
    return this.model
      .findOneAndUpdate(this.injectContextQuery({ _id: id }), {
        _deleted: true,
      })
      .exec();
  }

  public softDeleteByQuery(query: any): Promise<T | null> {
    return this.model.findOneAndUpdate(
      this.injectContextQuery(query as Partial<T>),
      {
        _deleted: true,
      },
    );
  }

  public injectContextQuery(query: Record<string, any>): Record<string, any> {
    return {
      ...query,
      ...this._context_query,
    };
  }

  public find(query: Record<string, any>): Promise<T[]> {
    return this.model.find(this.injectContextQuery(query)).exec();
  }

  public findWithPopulate(
    query: Record<string, any>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<T[]> {
    let queryBuilder = this.model.find(this.injectContextQuery(query));

    if (populate) {
      queryBuilder = queryBuilder.populate(populate);
    }

    return queryBuilder.exec();
  }

  public deleteById(id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  public delete(query: Record<string, any>): Promise<DeleteResult> {
    return this.model.deleteMany(this.injectContextQuery(query)).exec();
  }
}
