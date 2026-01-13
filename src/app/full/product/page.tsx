// src/app/full/product/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import TopNav from '../_components/TopNav';
import BannerCarousel from '@/app/h5/_components/BannerCarousel';
import { api } from '@/trpc/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Flex, Text, Tag, Center, Image } from '@chakra-ui/react';
import { Button } from '@/app/_components/ui';
import useCustomToast from '@/app/hooks/useCustomToast';
import { FiChevronRight, FiMinus, FiStar, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import {
    CloseButton,
    IconButton,
    Drawer,
    Portal,
    Spinner,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { STORE_GOOD_DATA_KEY, STORE_LAUNCH_INFO_KEY } from '@/app/const';
import { useSession } from 'next-auth/react';
import { Modal } from 'antd';

export default function ProductPage() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    const { showSuccessToast, showErrorToast } = useCustomToast();

    if (!id) {
        router.push('/h5');
    }
    const { data: product, isLoading } = api.product.get.useQuery({
        id,
        isPage: true,
    });
    const toggleFavoriteMutation = api.product.toggleFavorite.useMutation({
        onSuccess: (data) => {
            showSuccessToast(data.message);
            setCollected(data.isFavorited);
        },
        onError: (error) => {
            showErrorToast(error.message);
        },
    });
    const [selectedSpec, setSelectedSpec] = useState({
        id: '',
        price: 1,
        productId: '',
        stock: 0,
        value: '',
        image: '',
    });
    const [collected, setCollected] = useState(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 添加大图查看的状态管理
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const specPrices = product?.specs?.map((spec) => spec.price) ?? [];
    const minPrice = Math.min(...specPrices);
    const maxPrice = Math.max(...specPrices);
    const priceRange =
        minPrice !== maxPrice ? `${minPrice}~${maxPrice}` : minPrice;

    const title = product?.title ?? '';
    const [actionType, setActionType] = useState<'cart' | 'buy' | null>(null);

    const handlerCollect = () => {
        toggleFavoriteMutation.mutate({ productId: id });
    };

    // 处理小图点击事件
    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (product?.specs?.[0]) {
            setSelectedSpec(product.specs[0]);
            setCollected(product.isFavorited);
        }
    }, [product]);

    const handlerToCart = () => {
        if (!session) {
            showErrorToast('请先登录');
            router.push('/login');
            return;
        }
        setActionType('cart');
        setIsDrawerOpen(true);
    };

    const handlerToBuy = () => {
        if (!session) {
            showErrorToast('请先登录');
            router.push('/login');
            return;
        }
        setActionType('buy');
        setIsDrawerOpen(true);
    };
    const createPost = api.cart.add.useMutation({
        onSuccess: async (data) => {
            setIsDrawerOpen(false);
            showSuccessToast('添加成功');
        },
    });
    const handleConfirmAction = () => {
        if (actionType === 'cart') {
            createPost.mutate({
                productId: id,
                specId: selectedSpec.id,
                quantity,
            });
        } else if (actionType === 'buy') {
            // 跳转到订单确认页
            const params = btoa(id);
            localStorage.setItem(STORE_LAUNCH_INFO_KEY, params);
            localStorage.setItem(
                STORE_GOOD_DATA_KEY,
                JSON.stringify([
                    {
                        product: product,
                        selectedSpec: selectedSpec,
                        quantity,
                    },
                ])
            );
            router.push(`/full/confirm?data=${params}`);
        }
    };
    return (
        <Box bg="gray.50" minH="100vh" pb="80px">
            <TopNav title={product?.title} />
            <BannerCarousel
                banners={[
                    ...(product?.images?.map((item: string) => ({
                        image: item,
                    })) || []),
                    ...(product?.specs?.map((item: any) => ({
                        image: item.image,
                    })) || []),
                ]}
                height="380px"
            />
            <Box
                px={4}
                py={3}
                bg="white"
                boxShadow="2xs"
                display="flex"
                flexDirection="row"
                gap={2}
                overflowX="auto"
                overflowY="hidden"
                whiteSpace="nowrap"
                style={{
                    scrollbarWidth: 'none', // Firefox
                    WebkitOverflowScrolling: 'touch', // iOS 平滑滚动
                    msOverflowStyle: 'none', // IE/Edge (使用驼峰式命名)
                }}
            >
                {product?.images?.map((img: string, index: number) => (
                    <Image
                        key={index}
                        src={img}
                        alt={title}
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: '2px solid transparent',
                            flexShrink: 0,
                        }}
                        _hover={{
                            borderColor: 'blue.500',
                            opacity: 0.8,
                        }}
                        onClick={() => handleImageClick(img)}
                    />
                ))}
            </Box>
            <Box px={4} py={3} bg="white" boxShadow="2xs">
                <Flex align="center" justifyContent="space-between" mb={2}>
                    <Text
                        color="red.500"
                        fontWeight="bold"
                        fontSize="2xl"
                        mr={2}
                    >
                        ${priceRange}
                    </Text>
                </Flex>
                <Text fontWeight="semibold" fontSize="lg" mb={2}>
                    {title}
                </Text>
                <Box h="1px" bg="gray.100" my={2} />
                <Drawer.Root
                    placement="bottom"
                    open={isDrawerOpen}
                    onOpenChange={(e) => setIsDrawerOpen(e.open)}
                >
                    <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content>
                                <Drawer.Header>
                                    <Drawer.Title>
                                        <Flex align="center" w="100%">
                                            <Box boxSize="80px" mr={4}>
                                                <Image
                                                    src={
                                                        selectedSpec?.image ??
                                                        product?.images?.[0]
                                                    }
                                                    alt={title}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: '8px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </Box>
                                            <Box flex="1">
                                                <Text
                                                    color="orange.500"
                                                    fontWeight="bold"
                                                    fontSize="xl"
                                                >
                                                    ${selectedSpec.price}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </Drawer.Title>
                                </Drawer.Header>
                                <Drawer.Body>
                                    <Flex
                                        direction="column"
                                        align="center"
                                        mb={6}
                                    >
                                        <Box w="100%" mt={2}>
                                            <Text color="gray.500" mb={4}>
                                                规格
                                            </Text>

                                            {product?.specs?.map((item) => (
                                                <Box key={item.id}>
                                                    <Tag.Root
                                                        mb={2}
                                                        size="lg"
                                                        onClick={() =>
                                                            setSelectedSpec(
                                                                item
                                                            )
                                                        }
                                                        colorPalette={
                                                            selectedSpec.id ===
                                                            item.id
                                                                ? 'red'
                                                                : ''
                                                        }
                                                    >
                                                        <Tag.Label>
                                                            {item.value}
                                                        </Tag.Label>
                                                    </Tag.Root>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Flex>
                                </Drawer.Body>
                                <Drawer.Footer>
                                    <Button
                                        w="100%"
                                        borderRadius="md"
                                        bg="#fa2222"
                                        color="#fff"
                                        size="xl"
                                        onClick={handleConfirmAction}
                                        loading={createPost.isPending}
                                    >
                                        确认
                                    </Button>
                                </Drawer.Footer>
                                <Drawer.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Drawer.CloseTrigger>
                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>
                </Drawer.Root>
            </Box>
            <Box pt={4} mb="64px" px={6} whiteSpace="pre-wrap">
                {product?.description}
            </Box>
            {isLoading && (
                <Box
                    pos="absolute"
                    inset="0"
                    bg="bg/80"
                    bgColor="#fff"
                    style={{
                        backdropFilter: 'blur(8px)', // 高斯模糊
                        WebkitBackdropFilter: 'blur(8px)', // 兼容部分浏览器
                    }}
                >
                    <Center h="full">
                        <Spinner
                            color="red.500"
                            css={{ '--spinner-track-color': 'colors.gray.200' }}
                        />
                    </Center>
                </Box>
            )}

            {/* 大图查看Modal */}
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={'100%'}
                closable={false}
            >
                <Box p={0}>
                    <img
                        src={selectedImage}
                        alt={title}
                        style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain',
                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
}
