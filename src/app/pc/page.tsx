'use client';
import { Tabs, Image } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaTiktok, FaInstagramSquare } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';

import ContactMe from './_components/ContanctMe';
import Products from './_components/Products';
import { ImWhatsapp } from 'react-icons/im';
import { MdEmail } from 'react-icons/md';
import { IoMdChatboxes } from 'react-icons/io';
import {
    AiFillBank,
    AiFillTool,
    AiFillInsurance,
    AiFillTruck,
} from 'react-icons/ai';

export default function PCHome() {
    return (
        <>
            <div
                className="logo"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    // backgroundColor: '#2da884',
                    backgroundColor: '#2da884',
                    height: '60px',
                    alignItems: 'center',
                }}
            >
                <Image
                    src="/Luxifylogo.png"
                    alt="logo"
                    h="40px"
                    filter="brightness(0) invert(1)  drop-shadow(0 0 0 green)"
                />
            </div>
            <div
                className="nav"
                style={{
                    width: '100%',

                    padding: '0 40px',
                    backgroundColor: '#e4f4ef',
                }}
            >
                <Tabs.Root defaultValue="home" size="lg" textAlign="center">
                    <Tabs.List>
                        <Tabs.Trigger value="home">HOME</Tabs.Trigger>
                        <Tabs.Trigger value="products">
                            ALL PRODUCTS
                        </Tabs.Trigger>
                        <Tabs.Trigger value="contact">CONTACT US</Tabs.Trigger>
                        <Tabs.Trigger value="about">ABOUT</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="home" w="100%">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '20px 0',
                            }}
                        >
                            <span>
                                <ImWhatsapp size={40} />
                            </span>
                            <div
                                style={{
                                    // flex: 1,
                                    fontSize: '30px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Please click on the WhatsApp below to inquire.
                            </div>
                            <div
                                style={{
                                    // flex: 1,
                                    fontSize: '16px',
                                    // fontWeight: 'bold',
                                    textAlign: 'center',
                                    width: '60%',
                                }}
                            >
                                We only sell high quality products and never
                                provide inferior products. All products provide
                                perfect after-sales service. Welcome customers
                                who have high requirements for product quality
                                to contact us to order or become our
                                distributor.
                            </div>
                            <Image src="/Z_主题.jpg" alt="zhuti" />
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    gap: '30px',
                                    justifyContent: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        width: '20%',
                                        height: '450px',
                                        backgroundColor: '#ffffffff',
                                        borderRadius: '20px',
                                        padding: '20px',

                                        // 居中样式
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '35px',
                                                color: '#2da884',
                                            }}
                                        >
                                            <AiFillBank />
                                        </span>

                                        <span
                                            style={{
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Source Factory
                                        </span>
                                        <p
                                            style={{
                                                fontSize: '12px',
                                            }}
                                        >
                                            Focusing on China for fifteen years,
                                            only for high-end texture
                                        </p>
                                        <Image
                                            src="/gongchang.jpg"
                                            paddingTop="20px"
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        width: '20%',
                                        height: '450px',
                                        backgroundColor: '#ffffffff',
                                        borderRadius: '20px',
                                        padding: '20px',

                                        // 居中样式
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '35px',
                                                color: '#2da884',
                                            }}
                                        >
                                            <AiFillTool />
                                        </span>

                                        <span
                                            style={{
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            rigorous selection of materials
                                        </span>
                                        <p
                                            style={{
                                                fontSize: '12px',
                                            }}
                                        >
                                            Support processing customization,
                                            specific contact customer service
                                        </p>
                                        <Image
                                            src="/details.jpg"
                                            paddingTop="20px"
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        width: '20%',
                                        height: '450px',
                                        backgroundColor: '#ffffffff',
                                        borderRadius: '20px',
                                        padding: '20px',

                                        // 居中样式
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '35px',
                                                color: '#2da884',
                                            }}
                                        >
                                            <AiFillInsurance />
                                        </span>

                                        <span
                                            style={{
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            7 days replacement
                                        </span>
                                        <p
                                            style={{
                                                fontSize: '12px',
                                            }}
                                        >
                                            7 days return guarantee, the whole
                                            professional after-sales team to
                                            follow up, so that you can buy at
                                            ease ~!
                                        </p>
                                        <Image
                                            src="/M_买家秀-1-1024x977.jpg"
                                            paddingTop="20px"
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        width: '20%',
                                        height: '450px',
                                        backgroundColor: '#ffffffff',
                                        borderRadius: '20px',
                                        padding: '20px',

                                        // 居中样式
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '35px',
                                                color: '#2da884',
                                            }}
                                        >
                                            <AiFillTruck />
                                        </span>

                                        <span
                                            style={{
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Free shipping
                                        </span>
                                        <p
                                            style={{
                                                fontSize: '12px',
                                            }}
                                        >
                                            Direct logistics! 3-7 days after
                                            order confirmation
                                        </p>
                                        <Image
                                            src="/X_细节-1024x878.jpg"
                                            paddingTop="20px"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tabs.Content>
                    <Tabs.Content value="products">
                        <Products />
                    </Tabs.Content>
                    <Tabs.Content value="contact">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '20px 0',
                            }}
                        >
                            <div
                                style={{
                                    // flex: 1,
                                    padding: '40px 0',
                                    fontSize: '50px',
                                    fontWeight: 'bold',
                                }}
                            >
                                <p>Please click on the WhatsApp</p>
                                <p>below to inquire</p>
                            </div>
                            <div
                                style={{
                                    // flex: 1,
                                    fontSize: '16px',
                                    // fontWeight: 'bold',
                                    textAlign: 'center',
                                    width: '60%',
                                }}
                            >
                                We welcome new and existing customers to become
                                our agents and make inquiries. If you value
                                product quality, are interested in wholesaling
                                individual products, becoming our agent, or need
                                customized design/logo service, we are happy to
                                answer all your questions and meet your needs.
                                Feel free to contact us via WhatsApp: +86
                                18933999929
                            </div>
                            <div
                                className="foot"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: '30px',
                                    gap: '30px',
                                    paddingBottom: '100px',
                                }}
                            >
                                <div
                                    className="title"
                                    style={{
                                        width: '100%',
                                        lineHeight: '80px',
                                        height: '80px',
                                        backgroundColor: '#ffffffff',
                                        fontSize: '35px',
                                        fontWeight: 'bold',
                                        borderRadius: '30px',
                                    }}
                                >
                                    contact address
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        gap: '30px',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '20%',
                                            height: '200px',
                                            backgroundColor: '#ffffffff',
                                            borderRadius: '20px',
                                            padding: '20px',

                                            // 居中样式
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: '35px',
                                                    color: '#2da884',
                                                }}
                                            >
                                                <FaMapMarkerAlt />
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    color: '#2da884',
                                                }}
                                            >
                                                Address
                                            </span>
                                            <p
                                                style={{
                                                    fontSize: '16px',
                                                }}
                                            >
                                                A6682, Linklong International,
                                                Baiyun District, Guangzhou City,
                                                Guangdong Province, China
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            width: '20%',
                                            height: '200px',
                                            backgroundColor: '#ffffffff',
                                            borderRadius: '20px',
                                            padding: '20px',

                                            // 居中样式
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: '35px',
                                                    color: '#2da884',
                                                }}
                                            >
                                                <ImWhatsapp />
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    color: '#2da884',
                                                }}
                                            >
                                                WhatsApp
                                            </span>
                                            <p
                                                style={{
                                                    fontSize: '16px',
                                                }}
                                            >
                                                +86 18933999929
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            width: '20%',
                                            height: '200px',
                                            backgroundColor: '#ffffffff',
                                            borderRadius: '20px',
                                            padding: '20px',

                                            // 居中样式
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: '35px',
                                                    color: '#2da884',
                                                }}
                                            >
                                                <MdEmail />
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    color: '#2da884',
                                                }}
                                            >
                                                Email
                                            </span>
                                            <p
                                                style={{
                                                    fontSize: '16px',
                                                }}
                                            >
                                                dx327305@gmail.com
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            width: '20%',
                                            height: '200px',
                                            backgroundColor: '#ffffffff',
                                            borderRadius: '20px',
                                            padding: '20px',

                                            // 居中样式
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: '35px',
                                                    color: '#2da884',
                                                }}
                                            >
                                                <IoMdChatboxes />
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    color: '#2da884',
                                                }}
                                            >
                                                Follow us
                                            </span>
                                            <p
                                                style={{
                                                    fontSize: '26px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    gap: '18px',
                                                    paddingTop: '16px',
                                                }}
                                            >
                                                <a href="https://www.tiktok.com/@qingweixin">
                                                    <FaTiktok />
                                                </a>
                                                <FaInstagramSquare />
                                                <FaSquareXTwitter />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tabs.Content>
                    <Tabs.Content value="about">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '20px 0',
                            }}
                        >
                            <div
                                style={{
                                    // flex: 1,
                                    padding: '40px 0',
                                    fontSize: '50px',
                                    fontWeight: 'bold',
                                }}
                            >
                                <p>For those who know </p>
                                <p>quality </p>
                            </div>
                            <div
                                style={{
                                    // flex: 1,
                                    fontSize: '16px',
                                    // fontWeight: 'bold',
                                    textAlign: 'center',
                                    width: '60%',
                                }}
                            >
                                All products are made by disassembling and
                                reproducing the real ones. The biggest advantage
                                of these products is their price and quality,
                                it's not that the real ones are unaffordable,
                                but ours are more cost-effective!
                            </div>
                            <Image
                                src="/about1.jpg"
                                alt="about"
                                // width={600}
                                // height={400}
                            />
                            <div
                                style={{
                                    // flex: 1,
                                    padding: '40px 0',
                                    fontSize: '50px',
                                    fontWeight: 'bold',
                                }}
                            >
                                <p>Customized for you</p>
                            </div>
                            <div
                                style={{
                                    // flex: 1,
                                    fontSize: '16px',
                                    // fontWeight: 'bold',
                                    textAlign: 'center',
                                    width: '60%',
                                }}
                            >
                                The real design has nothing to do with the show
                                of novelty. Craftsmanship hides the temperature
                                of your palm, which fits your seriousness about
                                life; selected materials withstand the time
                                polishing, and become the bottom of your dream
                                with quality perseverance.
                            </div>
                            <Image
                                src="/about2.jpg"
                                alt="about"
                                // width={600}
                                // height={400}
                            />
                            <div
                                style={{
                                    // flex: 1,
                                    padding: '40px 0',
                                    fontSize: '50px',
                                    fontWeight: 'bold',
                                }}
                            >
                                <p>
                                    Please click on WhatsAp below to make an
                                    inquiry
                                </p>
                            </div>
                            <div
                                style={{
                                    // flex: 1,
                                    fontSize: '16px',
                                    // fontWeight: 'bold',
                                    textAlign: 'center',
                                    width: '60%',
                                }}
                            >
                                Only offer high-quality products, reject
                                inferior ones! Based on top-grade leather
                                materials and with exquisite craftsmanship as
                                the soul, each item embodies the ultimate
                                pursuit of quality. All products are equipped
                                with complete after-sales services, ensuring
                                that you can buy with peace of mind and use with
                                confidence. Whether you are an end customer
                                seeking texture or a distributor looking for
                                high-quality supplies, as long as you value
                                quality, please feel free to contact us at any
                                time to start a cooperation!
                            </div>
                            <Image
                                src="/D_关于.jpg"
                                alt="about"
                                // width={600}
                                // height={400}
                            />
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
                {/* 编写一个浮动在右下角的样式div */}
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: '#25D366',
                        borderRadius: '30px',
                    }}
                >
                    <ContactMe />
                </div>
            </div>
        </>
    );
}
