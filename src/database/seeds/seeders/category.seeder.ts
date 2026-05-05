import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Category } from '../../../modules/categories/entities/category.entity';
import { categories } from '../data/categories/category.data';

export default class CategorySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Category);

    console.log('🗂️  Seeding categories...');

    for (const item of categories) {
      const existing = await repository.findOne({
        where: { slug: item.slug },
      });

      if (!existing) {
        const category = repository.create(item);
        await repository.save(category);
        console.log(`  ✓ Created: ${item.name}`);
      } else {
        await repository.update({ slug: item.slug }, item);
        console.log(`  ↻ Updated: ${item.name}`);
      }
    }

    console.log('✅ Categories seeded successfully!');
  }
}
