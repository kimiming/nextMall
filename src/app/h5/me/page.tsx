'use client';

import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Image, Link } from '@chakra-ui/react';
import { ImWhatsapp } from 'react-icons/im';
import { FaMapMarkerAlt, FaTiktok, FaInstagramSquare } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { IoMdChatboxes } from 'react-icons/io';

type FooterItem = {
    icon: React.ReactNode;
    title: string;
    content: React.ReactNode | string;
};

export default function About() {
    const aboutText = [
        {
            title: 'Please click on the WhatsAppbelow to inquire',
            content:
                'We welcome new and existing customers to become our agents and make inquiries. If you value product quality, are interested in wholesaling individual products, becoming our agent, or need customized design/logo service, we are happy to answer all your questions and meet your needs. Feel free to contact us via WhatsApp: +86 18933999929',
        },
    ];
    const [itemsPerRow, setItemsPerRow] = useState(1);
    const footer: FooterItem[] = [
        {
            icon: <FaMapMarkerAlt size={30} />,
            title: 'Address',
            content:
                ' A6682, Linklong International,Baiyun District, Guangzhou City,Guangdong Province, China',
        },
        {
            icon: (
                <Link href="https://wa.me/8618933999929">
                    <ImWhatsapp size={30} />
                </Link>
            ),
            title: 'WhatsApp',
            content: ' +86 18933999929',
        },
        {
            icon: <MdEmail size={30} />,
            title: 'Email',
            content: 'dx327305@gmail.com',
        },
        {
            icon: <IoMdChatboxes size={30} />,
            title: 'Follow us',
            content: (
                <>
                    <Flex direction="row" gap={4} color="gray.500">
                        <Link href="https://www.tiktok.com/@qingweixin">
                            <FaTiktok size={30} color="black" />
                        </Link>
                        <FaInstagramSquare size={30} color="pink" />
                        <FaSquareXTwitter size={30} color="skyblue" />
                    </Flex>
                </>
            ),
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
        <Flex direction="column" paddingBottom={10}>
            <Flex justify="center" align="center" bg="#2da884">
                <Image src="/Luxify-logo.png" alt="luxify" w={108} />
            </Flex>
            {aboutText.length > 0
                ? aboutText.map((item, index) => (
                      <Box
                          px={6}
                          py={4}
                          textAlign="center"
                          bg="rgb(228, 244, 239)"
                          key={index}
                      >
                          <Text fontSize={24} fontWeight="bold">
                              {item.title}
                          </Text>
                          <Text>{item.content}</Text>
                          {/* <Image src={item.imageUrl} alt="about" py={4} /> */}
                      </Box>
                  ))
                : null}
            <Box
                px={6}
                py={4}
                fontSize={24}
                fontWeight="bold"
                textAlign="center"
                bg="rgb(228, 244, 239)"
                display={'flex'}
                justifyContent={'center'}
            >
                <Text borderRadius={30} bg="white" w={220}>
                    contact address
                </Text>
            </Box>
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
                            <Box color="gray.500">{item.content}</Box>
                        </Flex>
                    </div>
                ))}
            </Flex>
        </Flex>
    );
}
