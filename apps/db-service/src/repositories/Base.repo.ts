// infrastructure/db/repos/BaseRepo.ts
import type {
    Model, ModelStatic, WhereOptions, FindOptions, CreationAttributes, Attributes, Transaction,
} from "sequelize";

export type Page<T> = { items: T[]; total: number; page: number; pageSize: number };

export class BaseRepo<M extends Model> {
    protected Model: ModelStatic<M>;

    constructor(Model: ModelStatic<M>) {
        this.Model = Model;
    }

    // Create
    async create(data: CreationAttributes<M>, tx?: Transaction): Promise<M> {
        return this.Model.create(data as any, { transaction: tx });
    }

    // Read
    async findById(id: Attributes<M> extends { id: infer I } ? I : any, opts: FindOptions<M> = {}): Promise<M | null> {
        return this.Model.findByPk(id as any, opts);
    }

    async findOne(where: WhereOptions<Attributes<M>>, opts: FindOptions<M> = {}): Promise<M | null> {
        return this.Model.findOne({ where, ...opts });
    }

    async findMany(opts: FindOptions<M> = {}): Promise<M[]> {
        return this.Model.findAll(opts);
    }

    // Update (partial)
    async update(where: WhereOptions<Attributes<M>>, patch: Partial<Attributes<M>>, tx?: Transaction): Promise<number> {
        const [count] = await this.Model.update(patch, { where, transaction: tx });
        return count;
    }

    // Delete
    async remove(where: WhereOptions<Attributes<M>>, tx?: Transaction): Promise<number> {
        return this.Model.destroy({ where, transaction: tx });
    }

    // Pagination helper
    async page(
        where: WhereOptions<Attributes<M>>,
        page: number,
        pageSize: number,
        opts: Omit<FindOptions<M>, "where" | "offset" | "limit"> = {}
    ): Promise<Page<M>> {
        const offset = (page - 1) * pageSize;
        const { rows, count } = await this.Model.findAndCountAll({ where, offset, limit: pageSize, ...opts });
        return { items: rows, total: count, page, pageSize };
    }
}
