//TODO
make crud operations take primary key name and value and change DBSchema types to acomidate that chages

react-native-sql example
https://aboutreact.com/example-of-sqlite-database-in-react-native/

make user describe another store value like syncStorage to store sync time of each query by query key and date then have like deafult stale tile. Before in useCache Promise get need to check is it exist in syncStorage if soo check time if time not expaired dont call refetch if not fetch data

useCache flow: syncStorage < currentTime ? zustandStorage ? showItem : getFromPresistDb : fetch

maybe i future have syncerMutationStorage to fire mutation if user back online and if it will fail have integration with syncStorage to invalidate what was wrong
