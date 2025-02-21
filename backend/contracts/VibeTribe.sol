// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VibeTribe {
    struct Community {
        string name;
        string country;
        string location;
        uint peopleCount;
        string travelDates;
        string description;
        string imageSrc;
    }

    Community[] public communities;

    function createCommunity(
        string memory _name,
        string memory _country,
        string memory _location,
        uint _peopleCount,
        string memory _travelDates,
        string memory _description,
        string memory _imageSrc
    ) public {
        communities.push(Community(_name, _country, _location, _peopleCount, _travelDates, _description, _imageSrc));
    }

    // ✅ Fix: Return separate arrays instead of a struct array
    function getCommunities() public view returns (
        string[] memory names,
        string[] memory countries,
        string[] memory locations,
        uint[] memory peopleCounts,
        string[] memory travelDates,
        string[] memory descriptions,
        string[] memory imageSrcs
    ) {
        uint length = communities.length;

        // Allocate memory for each array
        names = new string[](length);
        countries = new string[](length);
        locations = new string[](length);
        peopleCounts = new uint[](length);
        travelDates = new string[](length);
        descriptions = new string[](length);
        imageSrcs = new string[](length);

        for (uint i = 0; i < length; i++) {
            Community storage community = communities[i];
            names[i] = community.name;
            countries[i] = community.country;
            locations[i] = community.location;
            peopleCounts[i] = community.peopleCount;
            travelDates[i] = community.travelDates;
            descriptions[i] = community.description;
            imageSrcs[i] = community.imageSrc;
        }
    }
}
