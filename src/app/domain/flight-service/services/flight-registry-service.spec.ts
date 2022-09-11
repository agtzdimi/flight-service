import { SecondFlightService } from './second-flight-service';
import { FirstFlightService } from './first-flight-service';
import { getUnitTestingModule } from '../../../test-utils/test-module';
import { FlightRegistryService } from './flight-registry-service';

let flightRegistryService: FlightRegistryService;
let firstFlightService: FirstFlightService;
let secondFlightService: SecondFlightService;

beforeEach(async () => {
  const testModule = await getUnitTestingModule(FlightRegistryService);
  flightRegistryService = testModule.get(FlightRegistryService);
  firstFlightService = testModule.get(FirstFlightService);
  secondFlightService = testModule.get(SecondFlightService);
});

test('getServices - returns both first and second service', () => {
  const flightRegistrySpy = flightRegistryService.getServices();

  expect(flightRegistrySpy[0]).toBe(firstFlightService);
  expect(flightRegistrySpy[1]).toBe(secondFlightService);
});
