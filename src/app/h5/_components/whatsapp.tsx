'use client';
import React, { useState } from 'react';
import { Button, Input, Popover, Portal, Text, Image } from '@chakra-ui/react';
import { ImWhatsapp } from 'react-icons/im';

export default function ContactMe() {
    const [isHover, setIsHover] = useState(false);
    return (
        <>
            <style>
                {`
            @keyframes whatsappBounce {
              0%, 100% {
                transform: translateY(0);
                box-shadow: 0 4px 16px rgba(45,168,132,0.2);
              }
              20% {
                transform: translateY(-15px) scale(1.05);
                box-shadow: 0 8px 32px rgba(45,168,132,0.3);
              }
              40% {
                transform: translateY(0) scale(1);
                box-shadow: 0 4px 16px rgba(45,168,132,0.2);
              }
              60% {
                transform: translateY(-8px) scale(1.03);
                box-shadow: 0 6px 24px rgba(45,168,132,0.25);
              }
              80% {
                transform: translateY(0) scale(1);
                box-shadow: 0 4px 16px rgba(45,168,132,0.2);
              }
            }
            `}
            </style>
            <div
                style={{
                    position: 'fixed',
                    right: 20,
                    bottom: 80,
                    zIndex: 999,
                    borderRadius: '30px',
                    // background: 'transparent',
                    animation: 'whatsappBounce 1s infinite',
                    // boxShadow: '0 4px 16px rgba(45,168,132,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
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
                                            href="https://wa.me/+86189339999"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 5,
                                                color: isHover
                                                    ? '#2da884'
                                                    : '#000000', // 悬停变红，默认蓝色
                                                textDecoration: 'none',
                                            }}
                                            onMouseEnter={() =>
                                                setIsHover(true)
                                            }
                                            onMouseLeave={() =>
                                                setIsHover(false)
                                            }
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
                                        Need help? Our team is just a message
                                        away
                                    </div>
                                </Popover.Body>
                            </Popover.Content>
                        </Popover.Positioner>
                    </Portal>
                </Popover.Root>
            </div>
        </>
    );
}
