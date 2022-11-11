import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { client } from '../../client';
import { Spinner } from '../../components';
import CardMemberList from '../../components/CardMemberList'
import Navigation from '../../container/Navigation'
import { memberQuery } from '../../utils/data';

function MemberListPage() {
    const [member, setMember] = useState(null);
    const router = useRouter();

    const {data: session} = useSession();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const query = memberQuery();
        client.fetch(query, { signal })
        .then((data) => {
            setMember(data);
        })
        .catch((err) => {
            if(err.name === "AbortError") return;
            router.push('/500');
        })

        return () => {
            controller.abort();
        }
    }, []);
    
    return (
       <>
            <Head>
                <title>Daftar anggota Forgematics Kelas A 2022</title>
                <meta name="description" content="Ini merupakan daftar anggota Informatika kelas A dengan julukan Forgematics angkatan 2022" />
            </Head>

            <Navigation>
                <section className="min-h-screen bg-[#9FC1FF]">
                    <div className="w-full flex flex-wrap justify-center items-center gap-4 p-4">
                        {!member ? (
                            <>
                                <div className="bg-white w-full h-[150px] p-4 rounded-lg max-w-[350px]"> <Spinner/> </div>
                                <div className="bg-white w-full h-[150px] p-4 rounded-lg max-w-[350px]"> <Spinner/> </div>
                                <div className="bg-white w-full h-[150px] p-4 rounded-lg max-w-[350px]"> <Spinner/> </div>
                            </>
                        ) : (
                            member.map((user) => (
                                <CardMemberList user={user} key={user._id} />
                            ))
                        )}
                    </div>
                </section>
            </Navigation>
       </>
    )
}

export default MemberListPage