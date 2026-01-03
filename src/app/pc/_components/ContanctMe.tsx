'use client';
import React, { useState } from 'react';
import { Button, Input, Popover, Portal, Text, Image } from '@chakra-ui/react';
import { ImWhatsapp } from 'react-icons/im';

export default function ContactMe() {
    const [isHover, setIsHover] = useState(false);
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <Button
                    colorPalette="green"
                    // variant="subtle"
                    w={200}
                    borderRadius={30}
                    h={12}
                    color="white"
                    fontSize={18}
                >
                    <ImWhatsapp size={40} />
                    Contanct Me
                </Button>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Arrow />
                        <Popover.Body padding={0}>
                            <Popover.Title
                                h="50px"
                                textAlign="center"
                                lineHeight="50px"
                                fontWeight="medium"
                                bgColor="green.500"
                                color="white"
                            >
                                contact me with whatsapp
                            </Popover.Title>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '20px 0',
                                }}
                            >
                                <a
                                    href="https://wa.me/1800123456"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 5,
                                        color: isHover ? '#2da884' : '#000000', // 悬停变红，默认蓝色
                                        textDecoration: 'none',
                                    }}
                                    onMouseEnter={() => setIsHover(true)}
                                    onMouseLeave={() => setIsHover(false)}
                                >
                                    <Image
                                        src="about1.jpg"
                                        boxSize="150px"
                                        borderRadius="full"
                                        fit="cover"
                                        alt="Naruto Uzumaki"
                                        w="50px"
                                        h="50px"
                                    />
                                    <span
                                        style={{
                                            color: 'rgb(159 157 157)',
                                        }}
                                    >
                                        Support
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Luxify
                                    </span>
                                </a>
                            </div>
                            <div
                                style={{
                                    textAlign: 'center',
                                    height: '50px',
                                    lineHeight: '50px',
                                    backgroundColor: 'rgb(245 245 245)',
                                }}
                            >
                                Need help? Our team is just a message away
                            </div>
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
}
