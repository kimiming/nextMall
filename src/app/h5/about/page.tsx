'use client';

import React from 'react';
import { Box, Flex, Text, Image, Center } from '@chakra-ui/react';

export default function About() {
    const aboutText = [
        {
            title: 'For those who know quality',
            id: 1,
            content:
                "All products are made by disassembling and reproducing the real ones. The biggest advantage of these products is their price and quality, it's not that the real ones are unaffordable, but ours are more cost-effective!",
            imageUrl: '/about1.jpg',
        },
        {
            title: 'Customized for you',
            id: 2,
            content:
                'The real design has nothing to do with the show of novelty. Craftsmanship hides the temperature of your palm, which fits your seriousness about life; selected materials withstand the time polishing, and become the bottom of your dream with quality perseverance.',
            imageUrl: '/about2.jpg',
        },
        {
            title: 'Please click on WhatsAp below to make an inquiry',
            id: 3,
            content:
                'Only offer high-quality products, reject inferior ones! Based on top-grade leather materials and with exquisite craftsmanship as the soul, each item embodies the ultimate pursuit of quality. All products are equipped with complete after-sales services, ensuring that you can buy with peace of mind and use with confidence. Whether you are an end customer seeking texture or a distributor looking for high-quality supplies, as long as you value quality, please feel free to contact us at any time to start a cooperation!',
            imageUrl: '/D_关于.jpg',
        },
    ];

    return (
        <Flex direction="column" paddingBottom={10}>
            <Flex justify="center" align="center" bg="#2da884">
                <Image src="/Luxify-logo.png" alt="luxify" w={108} />
            </Flex>
            {aboutText.map((item, index) => (
                <Box
                    key={item.id}
                    px={6}
                    py={4}
                    textAlign="center"
                    bg="rgb(228, 244, 239)"
                >
                    <Text fontSize={24} fontWeight="bold">
                        {item.title}
                    </Text>
                    <Text>{item.content}</Text>
                    <Image src={item.imageUrl} alt="about" />
                </Box>
            ))}
        </Flex>
    );
}
