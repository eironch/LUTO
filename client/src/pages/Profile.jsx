import React, { useLayoutEffect } from 'react'
import NavBar from '../components/NavBar'

function Profile(p) {
    useLayoutEffect(() => {
        p.setCurrentTab("Profile")
    })

    return (
        <div>
            <NavBar username={ p.username } currentTab={ p.currentTab } setCurrentTab={ p.setCurrentTab } />
            <div className="flex flex-col gap-3 p-3 h-svh bg-zinc-950">
                {/* space for top navbar */}
                <div className="grid w-full gap-3 h-16" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-2"></div>
                    <div className="col-span-11 h-16 rounded-3xl"></div>
                    <div className="col-span-2"></div>     
                </div>
                {/* content */}
                <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-4"></div>
                    <div className="col-span-11 block">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile