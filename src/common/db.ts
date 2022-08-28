import { DataSource } from 'typeorm';

let dataSource = null;

export function getDataSource() {
    if (dataSource) {
        return dataSource;
    }

    dataSource = generateDataSource();
    
    return dataSource;
}

function generateDataSource() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.TYPEORM_HOST,
        port: Number(process.env.TYPEORM_PORT) ?? 5432,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        entityPrefix: process.env.TYPEORM_ENTITY_PREFIX,
        entities: [process.env.TYPEORM_ENTITIES_DIR],
        migrations: [process.env.TYPEORM_MIGRATIONS_DIR],
    });

    return dataSource;
}
