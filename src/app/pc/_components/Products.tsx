'use client';

import React from 'react';
import { Box, Flex, Input, SimpleGrid, Text, Image } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';
import { ContentLoading } from '@/app/_components/LoadingSpinner';

export default function Products() {
    const router = useRouter();

    // 获取 isActive 的 banners
    const { data: bannerResponse, isLoading: bannersLoading } =
        api.banner.list.useQuery({ isActive: true, orderBy: 'sort' });
    const banners = bannerResponse?.data ?? [];

    const { data: categoryResponse, isLoading: categoryLoading } =
        api.category.list.useQuery(undefined, {
            refetchOnMount: 'always',
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60, // 1分钟缓存
            gcTime: 1000 * 60 * 5, // 5分钟垃圾回收
        });
    const category = categoryResponse?.data ?? [];

    const { data: productResponse, isLoading: productsLoading } =
        api.product.list.useQuery({
            orderBy: 'sales',
        });
    const products = productResponse?.data ?? [];

    const isLoading = bannersLoading || categoryLoading || productsLoading;

    if (isLoading) {
        return <ContentLoading text="首页加载中..." />;
    }

    return (
        <div>
            <h1
                style={{
                    fontSize: '30px',
                    height: '80px',
                    lineHeight: '20px',
                    padding: '20px 0 ',
                }}
            >
                All Products
            </h1>
            <div
                style={{
                    backgroundColor: '#f7f7f7',
                    borderRadius: '10px',
                    padding: '10px',
                }}
            >
                <Box px={4} mt={2} pb={4}>
                    <SimpleGrid columns={4} gap={4}>
                        {products?.map((item: any) => (
                            <Link
                                href={`/full/product?id=${item.id}`}
                                key={item.id}
                            >
                                <Box
                                    bg="white"
                                    borderRadius="sm"
                                    boxShadow="2xs"
                                    p={2}
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                >
                                    <Box
                                        w="100%"
                                        h="260px"
                                        mb={2}
                                        borderRadius="md"
                                        overflow="hidden"
                                        bg="#f7f7f7"
                                        position="relative"
                                    >
                                        <Image
                                            src={item.images?.[0]}
                                            alt={item.title}
                                            w="100%"
                                            h="100%"
                                            objectFit="cover"
                                            position="absolute"
                                            top={0}
                                            left={0}
                                        />
                                    </Box>
                                    <Text
                                        fontSize="md"
                                        py={2}
                                        color="gray.800"
                                        fontWeight="medium"
                                        truncate
                                        w="100%"
                                        textAlign="left"
                                        title={item.title}
                                    >
                                        {item.title}
                                    </Text>
                                    <Flex
                                        w="100%"
                                        align="center"
                                        justify="space-between"
                                    >
                                        <Text
                                            fontSize="sm"
                                            color="red.500"
                                            fontWeight="bold"
                                            textAlign="left"
                                        >
                                            <Text
                                                as="span"
                                                fontSize="md"
                                                color="red.400"
                                                verticalAlign="baseline"
                                            >
                                                ￥
                                            </Text>
                                            {item.specs[0]?.price.toFixed(2)}
                                        </Text>
                                        <Text
                                            fontSize="2xs"
                                            fontWeight="normal"
                                            color="gray.500"
                                        >
                                            已售{item.sales}件
                                        </Text>
                                    </Flex>
                                </Box>
                            </Link>
                        ))}
                    </SimpleGrid>
                </Box>
            </div>
        </div>
    );
}
