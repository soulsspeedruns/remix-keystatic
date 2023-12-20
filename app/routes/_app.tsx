import { Outlet } from '@remix-run/react'
import { Search } from '~/components/search'

export default function App() {
	return (
		<div>
			<Search />
			<nav>
				<ul>
					<li>Hello</li>
				</ul>
			</nav>
			<Outlet />
		</div>
	)
}
