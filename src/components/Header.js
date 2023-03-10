import React, { useContext } from "react";
import { Button, notification } from "antd";
import Web3 from "web3";
import contractABI from "../contracts/contractABI.json";
import UserContext from "../context/user/UserContext";
import "../App.css";

function Header() {
	const user = useContext(UserContext);
	const GöerliNetworkId = 5;
	const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
	const connectWallet = async () => {
		if (window.ethereum) {
			const newWeb3 = new Web3(window.ethereum);
			const accounts = await newWeb3.eth.requestAccounts();
			const contractInstance = new newWeb3.eth.Contract(
				contractABI,
				contractAddress
			);
			const networkId = await newWeb3.eth.net.getId();
			if (networkId === GöerliNetworkId) {
				const tokenContract = await contractInstance.methods;
				var decimal = await tokenContract.decimals().call();
				var balance = await tokenContract.balanceOf(accounts[0]).call(); //accounts[0]
				var adjustedBalance = balance / Math.pow(10, decimal);
				var tokenName = await tokenContract.name().call();
				var tokenSymbol = await tokenContract.symbol().call();
				user.updateUserInfo({
					address: accounts[0],
					tokenName,
					tokenSymbol,
					balance: adjustedBalance,
				});
				notification.success({
					message: "You are successfully connected.",
				});
			} else {
				notification.error({ message: "Please switch to Goerli Network" });
			}
		} else {
			notification.error({ message: `Please install Metamask` });
		}
	};
	return (
		<div className="header-background">
			<span className="right-aligned-item">
				<Button onClick={connectWallet} block={true} disabled={user?.state?.address} type="primary">
					<div className="button-overflow-trailing-ellipsis">
						{user?.state?.address
							? `Contract Address:${user?.state?.address}`
							: "Connect Wallet"}
					</div>
				</Button>
			</span>
		</div>
	);
}

export default Header;
