'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, Text, Image, Badge, SimpleGrid } from '@chakra-ui/react';
import { ImWhatsapp } from 'react-icons/im';
import {
    AiFillBank,
    AiFillTool,
    AiFillInsurance,
    AiFillTruck,
} from 'react-icons/ai';
type FooterItem = {
    icon: React.ReactNode;
    title: string;
    content: string;
    imageUrl: string;
};

export default function Homepage() {
    const [itemsPerRow, setItemsPerRow] = useState(1);
    const footer: FooterItem[] = [
        {
            icon: <AiFillBank size={30} />,
            title: 'Source Factory',
            content:
                'Focusing on China for fifteen years, only for high-end texture',
            imageUrl: '/gongchang.jpg',
        },
        {
            icon: <AiFillTool size={30} />,
            title: 'rigorous selection of materials',
            content:
                'Support processing customization, specific contact customer service',
            imageUrl: '/details.jpg',
        },
        {
            icon: <AiFillInsurance size={30} />,
            title: '7 days replacement',
            content:
                '7 days return guarantee, the whole professional after-sales team to follow up, so that you can buy at ease ~!',
            imageUrl: '/M_买家秀-1-1024x977.jpg',
        },
        {
            icon: <AiFillTruck size={30} />,
            title: 'Free shipping',
            content: 'Direct logistics! 3-7 days after order confirmation',
            imageUrl: '/X_细节-1024x878.jpg',
        },
    ];
    useEffect(() => {
        function handleResize() {
            // 假设 iPad 宽度大于 768px
            if (window.innerWidth >= 768) {
                setItemsPerRow(2); // iPad及以上一行两个
            } else {
                setItemsPerRow(1); // 手机一行一个
            }
        }
        handleResize(); // 初始化判断
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <Box minH="100vh" bg="gray.50">
            {/* 居中logo 并且背景颜色是#2da884 */}
            <Flex justify="center" align="center" bg="#2da884">
                <Image src="/Luxify-logo.png" alt="luxify" w={108} />
            </Flex>
            <Flex
                justify="center"
                direction="column"
                align="center"
                px={6}
                py={2}
                bg="rgb(228, 244, 239)"
                textAlign="center"
            >
                <span>
                    <ImWhatsapp size={30} color="#2da884" />
                </span>
                <Text fontSize="xl" fontWeight="bold" color="#2da884">
                    Please click on the WhatsApp below to inquire.
                </Text>
                <Text>
                    We only sell high quality products and never provide
                    inferior products. All products provide perfect after-sales
                    service. Welcome customers who have high requirements for
                    product quality to contact us to order or become our
                    distributor.
                </Text>
                <Image src="/Z_主题.jpg" alt="luxify" />
            </Flex>

            {/* 如果是手机就显示一个一行iPad就显示两个 */}
            <Flex
                wrap="wrap"
                bg="rgb(228, 244, 239)"
                px={6}
                py={4}
                paddingBottom={20}
            >
                {footer.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            width: itemsPerRow === 2 ? '50%' : '100%',
                            boxSizing: 'border-box',
                        }}
                    >
                        {/* 渲染你的内容 */}
                        <Flex
                            direction="column"
                            align="center"
                            py={4}
                            px={6}
                            bg="white"
                            mx={2}
                            my={2}
                            borderRadius={10}
                        >
                            <Box color="#2da884">{item.icon}</Box>
                            <Text fontWeight="bold" mt={2} color="#2da884">
                                {item.title}
                            </Text>
                            <Text mt={1} color="gray.500">
                                {item.content}
                            </Text>
                            <Image src={item.imageUrl} alt={item.title} />
                        </Flex>
                    </div>
                ))}
            </Flex>
        </Box>
    );
}
