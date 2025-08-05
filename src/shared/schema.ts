import { sql } from 'drizzle-orm'
import { pgTable, text, varchar, numeric, integer } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const users = pgTable('users', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  membershipTier: text('membership_tier').notNull().default('premium'),
})

export const portfolios = pgTable('portfolios', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id')
    .notNull()
    .references(() => users.id),
  totalValue: numeric('total_value', { precision: 12, scale: 2 }).notNull(),
  dailyChange: numeric('daily_change', { precision: 12, scale: 2 }).notNull(),
  dailyChangePercent: numeric('daily_change_percent', {
    precision: 5,
    scale: 2,
  }).notNull(),
  currentAPY: numeric('current_apy', { precision: 5, scale: 2 }).notNull(),
  monthlyEarnings: numeric('monthly_earnings', {
    precision: 12,
    scale: 2,
  }).notNull(),
  growth: numeric('growth', { precision: 12, scale: 2 }).notNull(),
  earningPercentage: numeric('earning_percentage', {
    precision: 5,
    scale: 2,
  }).notNull(),
})

export const yieldOpportunities = pgTable('yield_opportunities', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  protocol: text('protocol').notNull(),
  apy: numeric('apy', { precision: 5, scale: 2 }).notNull(),
  riskLevel: text('risk_level').notNull(),
  icon: text('icon').notNull(),
  iconColor: text('icon_color').notNull(),
})

export const assetAllocations = pgTable('asset_allocations', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  portfolioId: varchar('portfolio_id')
    .notNull()
    .references(() => portfolios.id),
  assetName: text('asset_name').notNull(),
  assetSymbol: text('asset_symbol').notNull(),
  percentage: numeric('percentage', { precision: 5, scale: 2 }).notNull(),
  value: numeric('value', { precision: 12, scale: 2 }).notNull(),
  color: text('color').notNull(),
  changePercent: numeric('change_percent', {
    precision: 5,
    scale: 2,
  }).notNull(),
  isEarning: text('is_earning').notNull().default('true'),
})

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
})

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
})

export const insertYieldOpportunitySchema = createInsertSchema(
  yieldOpportunities,
).omit({
  id: true,
})

export const insertAssetAllocationSchema = createInsertSchema(
  assetAllocations,
).omit({
  id: true,
})

export type InsertUser = z.infer<typeof insertUserSchema>
export type User = typeof users.$inferSelect
export type Portfolio = typeof portfolios.$inferSelect
export type YieldOpportunity = typeof yieldOpportunities.$inferSelect
export type AssetAllocation = typeof assetAllocations.$inferSelect
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>
export type InsertYieldOpportunity = z.infer<
  typeof insertYieldOpportunitySchema
>
export type InsertAssetAllocation = z.infer<typeof insertAssetAllocationSchema>
