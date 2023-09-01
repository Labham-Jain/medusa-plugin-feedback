import { BaseEntity, Product, Customer } from "@medusajs/medusa"
import { generateEntityId } from "@medusajs/utils"
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm"
import { Max, Min } from "class-validator"

@Entity()
export class ProductFeedback extends BaseEntity {
  @Index()
  @Column({ type: "varchar", nullable: true })
  product_id: string

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product

  @Column({ type: "varchar", nullable: false })
  customer_id: string

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column({ type: "int" })
  @Min(1)
  @Max(100)
  rating: number

  @Column({ nullable: true })
  title: string

  @Column({ nullable: true })
  body: string

  @Column({ type: "boolean", nullable: false })
  approved: boolean;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "feedback")
  }
}