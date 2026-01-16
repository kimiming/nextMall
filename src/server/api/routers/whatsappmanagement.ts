import { z } from 'zod';
import {
    createTRPCRouter,
    protectedProcedure,
    superAdminProcedure,
    publicProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

// 数据结构model WsNumber {
//   id         String   @id @default(cuid()) // 主键
//   phone      String   @unique
//   image      String?  // 头像
//   text       String?
//   name       String?
//   createdAt  DateTime @default(now())       // 创建时间
// }

export const whatsappManagementRouter = createTRPCRouter({
    // 获取所有WhatsApp号码，支持分页
    list: publicProcedure
        .input(
            z
                .object({
                    page: z.number().min(1).optional().default(1),
                    pageSize: z.number().min(1).max(100).optional().default(10),
                    orderBy: z.string().optional(),
                    order: z.enum(['asc', 'desc']).optional(),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            const page = input?.page ?? 1;
            const pageSize = input?.pageSize ?? 10;
            const skip = (page - 1) * pageSize;

            const where = {}; // 可以添加过滤条件

            // 获取总数
            const total = await ctx.db.wsNumber.count({ where });

            // 获取分页数据
            const data = await ctx.db.wsNumber.findMany({
                orderBy: input?.orderBy
                    ? { [input.orderBy]: input.order ?? 'asc' }
                    : { createdAt: 'desc' },
                where,
                skip,
                take: pageSize,
            });

            return {
                data,
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize),
                },
            };
        }),

    // 获取单个WhatsApp号码
    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const wsNumber = await ctx.db.wsNumber.findUnique({
                where: { id: input.id },
            });

            if (!wsNumber) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'WhatsApp号码不存在',
                });
            }

            return wsNumber;
        }),

    // 创建新的WhatsApp号码
    create: superAdminProcedure
        .input(
            z.object({
                phone: z.string().min(10).max(15),
                image: z.string().optional(),
                text: z.string().optional(),
                name: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // 检查手机号是否已存在
            const existingPhone = await ctx.db.wsNumber.findUnique({
                where: { phone: input.phone },
            });

            if (existingPhone) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: '手机号已存在',
                });
            }

            return ctx.db.wsNumber.create({
                data: {
                    phone: input.phone,
                    image: input.image,
                    text: input.text,
                    name: input.name,
                },
            });
        }),

    // 更新WhatsApp号码
    update: superAdminProcedure
        .input(
            z.object({
                id: z.string(),
                phone: z.string().min(10).max(15).optional(),
                image: z.string().optional(),
                text: z.string().optional(),
                name: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...updateData } = input;

            // 检查是否存在
            const existingWsNumber = await ctx.db.wsNumber.findUnique({
                where: { id },
            });

            if (!existingWsNumber) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'WhatsApp号码不存在',
                });
            }

            // 如果更新手机号，检查是否与其他记录冲突
            if (input.phone && input.phone !== existingWsNumber.phone) {
                const existingPhone = await ctx.db.wsNumber.findUnique({
                    where: { phone: input.phone },
                });

                if (existingPhone) {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: '手机号已存在',
                    });
                }
            }

            return ctx.db.wsNumber.update({
                where: { id },
                data: updateData,
            });
        }),

    // 删除WhatsApp号码
    delete: superAdminProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const wsNumber = await ctx.db.wsNumber.findUnique({
                where: { id: input.id },
            });

            if (!wsNumber) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'WhatsApp号码不存在',
                });
            }

            return ctx.db.wsNumber.delete({
                where: { id: input.id },
            });
        }),
});
