import 'dotenv/config';

import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

const sqliteStorage = process.env.SQLITE_STORAGE ?? 'database.sqlite';

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      logging: false,
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: sqliteStorage,
      logging: false,
    });

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare role: CreationOptional<string>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'USER',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  },
);

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: CreationOptional<string>;
  declare content: string;
  declare author: string;
  declare createdAt: CreationOptional<Date>;
  declare userId: ForeignKey<User['id']>;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'posts',
    timestamps: false,
  },
);

User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

let initialized = false;

export const initializeDatabase = async () => {
  if (initialized) {
    return;
  }

  await sequelize.authenticate();
  await sequelize.sync();
  initialized = true;
};

export type PublicUser = {
  id: number;
  email: string;
  role: string;
};

export { sequelize };
