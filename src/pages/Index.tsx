import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';
import ReactApexChart from 'react-apexcharts';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const Index = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const db = getFirestore();

    const [loading, setLoading] = useState(true);
    const [salesByCategory, setSalesByCategory] = useState({
        series: [0, 0, 0],
        options: { /* Initial chart options */ }
    });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'bookings'));
                const bookings = querySnapshot.docs.map(doc => doc.data());
                
                const newBookings = bookings.filter(booking => booking.status === 'booking added').length;
                const pendingBookings = bookings.filter(booking => [
                    'Order Received',
                    'Contacted Customer',
                    'Vehicle Picked',
                    'Vehicle Confirmed',
                    'To DropOff Location',
                    'Vehicle dropoff'
                ].includes(booking.status)).length;
                const completedBookings = bookings.filter(booking => booking.status === 'Order Completed').length;

                setSalesByCategory({
                    series: [newBookings, pendingBookings, completedBookings],
                    options: {
                        chart: {
                            type: 'donut',
                            height: 460,
                            fontFamily: 'Nunito, sans-serif',
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        stroke: {
                            show: true,
                            width: 25,
                            colors: isDark ? '#0e1726' : '#fff',
                        },
                        colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
                        legend: {
                            position: 'bottom',
                            horizontalAlign: 'center',
                            fontSize: '14px',
                            markers: {
                                width: 10,
                                height: 10,
                                offsetX: -2,
                            },
                            height: 50,
                            offsetY: 20,
                        },
                        plotOptions: {
                            pie: {
                                donut: {
                                    size: '65%',
                                    background: 'transparent',
                                    labels: {
                                        show: true,
                                        name: {
                                            show: true,
                                            fontSize: '29px',
                                            offsetY: -10,
                                        },
                                        value: {
                                            show: true,
                                            fontSize: '26px',
                                            color: isDark ? '#bfc9d4' : undefined,
                                            offsetY: 16,
                                            formatter: (val: any) => {
                                                return val;
                                            },
                                        },
                                        total: {
                                            show: true,
                                            label: 'Total',
                                            color: '#888ea8',
                                            fontSize: '29px',
                                            formatter: (w: any) => {
                                                return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                                    return a + b;
                                                }, 0);
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        labels: ['New Bookings', 'Pending Bookings', 'Completed Bookings'],
                        states: {
                            hover: {
                                filter: {
                                    type: 'none',
                                    value: 0.15,
                                },
                            },
                            active: {
                                filter: {
                                    type: 'none',
                                    value: 0.15,
                                },
                            },
                        },
                    }
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [isDark]);

    return (
        <div className="container mx-auto p-6 bg-cover bg-center bg-no-repeat">
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Bookings</span>
                </li>
            </ul>

            <div className="pt-5">
                
                <div className="grid xl:grid-cols-1 gap-6 mb-6">
                <div className="grid xl:grid-cols-3 gap-6 mb-6">
                    <div className="panel bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg p-6">
                        <h5 className="font-semibold text-lg mb-3">New Bookings</h5>
                        <p className="text-2xl">{salesByCategory.series[0]}</p>
                    </div>
                    <div className="panel bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-lg p-6">
                        <h5 className="font-semibold text-lg mb-3">Pending Bookings</h5>
                        <p className="text-2xl">{salesByCategory.series[1]}</p>
                    </div>
                    <div className="panel bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg shadow-lg p-6">
                        <h5 className="font-semibold text-lg mb-3">Completed Bookings</h5>
                        <p className="text-2xl">{salesByCategory.series[2]}</p>
                    </div>
                </div>

                <div className="panel bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 text-white rounded-lg shadow-lg p-6">
                    <h5 className="font-semibold text-lg mb-3">Booking Statistics</h5>
                    <p className="text-md">Here you can see the statistics of all bookings categorized by their status.</p>
                </div>
                    <div className="panel h-full bg-gradient-to-r from-blue-200 to-blue-400 text-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg">Bookings By Category</h5>
                            <div className="flex space-x-2 rtl:space-x-reverse">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700">Refresh</button>
                                <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700">Export</button>
                            </div>
                        </div>
                        <div>
                            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
                                {loading ? (
                                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
                                        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                                    </div>
                                ) : (
                                    <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

               
            </div>
        </div>
    );
};

export default Index;
