import mongoose from 'mongoose';

const userTaskSchema = new mongoose.Schema({
  TelegramId: {
    type: String,
    ref: 'User', // Связь с коллекцией пользователей по TelegramId
    required: true,
  },
  tasks: [
    {
      taskId: {
        type: Number,
        required: true,
        unique: true,
      },
      tasktype: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      reward: {
        type: Number,
        required: true,
      },
      icon: {
        type: String, // Иконка не может быть JSX-элементом в MongoDB, можно хранить строковое значение или путь
        
      },
      status: {
        type: String,
        default: 'available',
      },
      progress: {
        type: Number,
        default: 0,
      },
      rewardPaid: {
        type: Boolean,
        default: false,
      },
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Создание или использование существующей модели
const UserTasks = mongoose.models.UserTasks || mongoose.model('UserTasks', userTaskSchema);
export default UserTasks;
