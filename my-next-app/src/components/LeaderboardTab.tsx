

'use client'

import PawsLogo from '@/icons/PawsLogo'
import { trophy } from '@/images';
import { sun } from '@/images';
import Image from 'next/image'
import useUserStore from '@/stores/useUserStore'; // Подключаем хранилище пользователя
import cards from '@/components/data/cards'; // Данные карт
import CardList from './CardList'; // Компонент для рендеринга списка карт





export default function CardCollection() {

    return (
        <div>
          {/* Другие компоненты */}
          <CardList cards={cards} />
        </div>
      );

}
    