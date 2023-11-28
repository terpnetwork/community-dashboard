import React from "react"
import { PageHeaderDescription, PageHeaderHeading } from "@/components/utils/page-header";

export function BlurredContent() {
    return (
        <div style={{ filter: 'blur(5px)', pointerEvents: 'none' }}>
        <div className="steps-card">
          <div className="inner-card">
            <div className="step-one-card">
              <PageHeaderHeading>2. Connect Cosmos Wallet</PageHeaderHeading>
              <PageHeaderDescription></PageHeaderDescription>
              <br />
            </div>
          </div>
        </div>
        <div className="steps-card">
          <div className="inner-card">
            <div className="step-one-card">
              <PageHeaderHeading>3. Verify Metamask Ownership</PageHeaderHeading>
              <PageHeaderDescription></PageHeaderDescription>
              <p>A signed message will verify you own your wallet.</p>
              <br />
              <button className="buttonStyle">Sign & Verify</button>
            </div>
          </div>
        </div>
        <div className="steps-card">
          <div className="inner-card">
            <div className="step-one-card">
              <PageHeaderHeading>4. Setup Terp Account & <br /> Claim Your Headstash</PageHeaderHeading>
              <PageHeaderDescription> Transactions on Terp Network require fee's, 
                <br /> We've got you covered for this one! 👍
              </PageHeaderDescription>
              <br />
              <br />
              <button className="secondButtonStyle">
                a. Setup Account
              </button>
              <button className="buttonStyle">
                b. Claim Headstash
              </button>
              <br />
            </div>
          </div>
        </div>
      </div>
    )
}